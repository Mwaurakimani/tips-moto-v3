<?php
namespace App\Http\Controllers;

use App\Models\League;
use App\Models\Sport;
use App\Models\Team;
use App\Models\MatchModel;
use App\Models\Tip;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PostMatchesController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Accept raw JSON object like: { "max": [...], "avg": [...], "min": [...] }
        $data = $request->json()->all();

        if (!$data || !is_array($data)) {
            return response()->json(['message' => 'Invalid or empty JSON payload.'], 422);
        }

        $footballId = Sport::where('name', 'Football')->value('id');
        if (!$footballId) {
            return response()->json(['message' => 'Sport "Football" not found. Seed/create it first.'], 500);
        }

        $totalProcessed = 0;
        $newMatches     = 0;
        $newTips        = 0;
        $skipped        = [];

        DB::transaction(function () use (
            $data,
            $footballId,
            &$totalProcessed,
            &$newMatches,
            &$newTips,
            &$skipped
        ) {
            foreach ($data as $confidenceLevel => $matches) {
                if (!is_iterable($matches)) {
                    continue;
                }

                foreach ($matches as $index => $row) {
                    $leagueName = $row['league'] ?? null;
                    if (!$leagueName) {
                        continue;
                    }

                    // League
                    $league = League::updateOrCreate(
                        ['name' => $leagueName],
                        [
                            'name'     => $leagueName,
                            'slug'     => Str::slug($leagueName),
                            'sport_id' => $footballId,
                        ]
                    );

                    // Teams validation
                    $homeName = $row['Home Team'] ?? null;
                    $awayName = $row['Away Team'] ?? null;

                    if (empty($homeName) || empty($awayName)) {
                        $skipped[] = [
                            'confidence_level' => $confidenceLevel,
                            'index'            => $index,
                            'league'           => $leagueName,
                            'home_team'        => $homeName,
                            'away_team'        => $awayName,
                            'kickoff'          => $row['date'] ?? null,
                        ];
                        continue;
                    }

                    // Teams
                    $homeTeam = Team::updateOrCreate(
                        ['league_id' => $league->id, 'name' => $homeName],
                        [
                            'short_name' => $row['home_short'] ?? null,
                            'country'    => $row['home_country'] ?? null,
                            'logo_url'   => $row['home_logo'] ?? null,
                        ]
                    );

                    $awayTeam = Team::updateOrCreate(
                        ['league_id' => $league->id, 'name' => $awayName],
                        [
                            'short_name' => $row['away_short'] ?? null,
                            'country'    => $row['away_country'] ?? null,
                            'logo_url'   => $row['away_logo'] ?? null,
                        ]
                    );

                    // Kickoff
                    $kickoffAt = isset($row['date'])
                        ? Carbon::parse($row['date'])
                        : now();

                    // Match
                    $match = MatchModel::updateOrCreate(
                        [
                            'league_id'    => $league->id,
                            'home_team_id' => $homeTeam->id,
                            'away_team_id' => $awayTeam->id,
                            'kickoff_at'   => $kickoffAt,
                        ],
                        [
                            'venue'          => $row['venue'] ?? null,
                            'status'         => $row['status'] ?? 'scheduled',
                            'score_home'     => $row['score_home'] ?? null,
                            'score_away'     => $row['score_away'] ?? null,
                            'tip_confidence' => $confidenceLevel,
                        ]
                    );

                    $totalProcessed++;
                    if ($match->wasRecentlyCreated) {
                        $newMatches++;
                    }

                    // Tips
                    if (!empty($row['tips']) && is_array($row['tips'])) {
                        foreach ($row['tips'] as $tipType => $tipData) {
                            // NOTE: Over/Under block is intentionally left disabled as in your script.
                            if ($tipType === 'Over/Under' && is_array($tipData)) {
                                // Keep commented unless you’re ready to map its structure.
                                // See your original code for reference.
                                continue;
                            }

                            if (!is_array($tipData) || !isset($tipData['odds'])) {
                                continue;
                            }

                            $riskLevel = match ($confidenceLevel) {
                                'max' => 'high',
                                'avg' => 'mid',
                                'min' => 'low',
                                default => 'unknown',
                            };

                            $predictionValue = match ($tipType) {
                                '1X_X2_12' => match ($tipData['result']) {
                                    1 => 'Home win/Draw',
                                    0 => 'Away win/Draw',
                                    -1 => 'Home win/Away win',
                                    default => null,
                                },
                                '1_X_2' => match ($tipData['result']) {
                                    1 => '1',
                                    0 => 'x',
                                    -1 => '2',
                                    default => null,
                                },
                                'GG_NG' => match ($tipData['result']) {
                                    -1 => 'GG',
                                    1 => 'NG',
                                    default => null,
                                },
                                default => null,
                            };

                            Tip::updateOrCreate(
                                [
                                    'match_id'        => $match->id,
                                    'prediction_type' => $tipType,
                                    'pick_label'      => $predictionValue,
                                ],
                                [
                                    'prediction_value' => $tipData['result'] ?? null,
                                    'risk_level'       => $riskLevel,
                                    'is_free'          => 0,
                                    'free_for_date'    => Carbon::today(),
                                ]
                            );

                            $newTips++;
                        }
                    }
                }
            }
        }, 3);

        return response()->json([
            'message'         => 'Processed matches & tips from request JSON.',
            'processed'       => $totalProcessed,
            'new_matches'     => $newMatches,
            'new_tips'        => $newTips,
            'skipped'         => $skipped,
        ]);
    }

    private function mapResult($val): string
    {
        return match ($val) {
            1, 'won'  => 'won',
            -1, 'lost' => 'lost',
            default   => 'pending',
        };
    }
}
