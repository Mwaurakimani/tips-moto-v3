<?php

namespace App\SystemClasses\DataExtractors;

use App\Models\League;
use App\Models\Sport;
use App\Models\SubscriptionPlan;
use App\Models\Team;
use App\Models\MatchModel;
use App\Models\Tip;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class JackpotExtractor
{
    private static array $statistics = [];

    /**
     * Extract and process jackpot match data
     */
    public static function extract(?string $jsonData): array
    {
        if (!$jsonData) {
            return ['error' => 'No data provided'];
        }

        self::initializeStatistics();
        $dataCollection = collect(json_decode($jsonData, true));

        if (!$dataCollection) {
            return ['error' => 'Invalid JSON data'];
        }


        foreach ($dataCollection as $confidenceLevel => $matches) {
            if (!is_array($matches)) {
                continue;
            }

            foreach ($matches as $index => $matchData) {
                self::processMatch($matchData, $confidenceLevel, $index);
            }
        }

        return self::$statistics;
    }

    private static function initializeStatistics(): void
    {
        self::$statistics = [
            'total_processed' => 0,
            'new_matches' => 0,
            'new_tips' => 0,
            'skipped' => [],
            'plans_updated' => []
        ];
    }

    private static function processMatch(array $matchData, string $confidenceLevel, int $index): void
    {
        $leagueName = $matchData['league'] ?? null;
        if (!$leagueName) {
            return;
        }

        // Validate required team data
        $homeName = $matchData['Home Team'] ?? null;
        $awayName = $matchData['Away Team'] ?? null;

        if (empty($homeName) || empty($awayName)) {
            self::$statistics['skipped'][] = [
                'confidence_level' => $confidenceLevel,
                'index' => $index,
                'league' => $leagueName,
                'home_team' => $homeName,
                'away_team' => $awayName,
                'kickoff' => $matchData['date'] ?? null,
                'reason' => 'Missing team data'
            ];
            return;
        }

        // Create/update league, teams, and match
        $league = self::ensureLeague($leagueName);
        $homeTeam = self::ensureTeam($league->id, $homeName, $matchData, 'home');
        $awayTeam = self::ensureTeam($league->id, $awayName, $matchData, 'away');
        $match = self::ensureMatch($league, $homeTeam, $awayTeam, $matchData, $confidenceLevel);

        self::$statistics['total_processed']++;
        if ($match->wasRecentlyCreated) {
            self::$statistics['new_matches']++;
        }

        // Process tips and update subscription plans
        $createdTipIds = self::processTips($match, $matchData['tips'] ?? [], $confidenceLevel);

        if (!empty($createdTipIds)) {
            self::loadTipsToPlan($createdTipIds, $confidenceLevel, $matchData);
        }
    }

    private static function ensureLeague(string $leagueName): League
    {
        return League::updateOrCreate(
            ['name' => $leagueName],
            [
                'name' => $leagueName,
                'slug' => $leagueName,
                'sport_id' => Sport::where('name', 'Football')->first()?->id ?? 1,
            ]
        );
    }

    private static function ensureTeam(int $leagueId, string $teamName, array $matchData, string $prefix): Team
    {
        return Team::updateOrCreate(
            ['league_id' => $leagueId, 'name' => $teamName],
            [
                'short_name' => $matchData["{$prefix}_short"] ?? null,
                'country' => $matchData["{$prefix}_country"] ?? null,
                'logo_url' => $matchData["{$prefix}_logo"] ?? null
            ]
        );
    }

    private static function ensureMatch(League $league, Team $homeTeam, Team $awayTeam, array $matchData, string $confidenceLevel): MatchModel
    {
        $kickoffAt = isset($matchData['date']) ? Carbon::parse($matchData['date']) : now();

        return MatchModel::updateOrCreate(
            [
                'league_id' => $league->id,
                'home_team_id' => $homeTeam->id,
                'away_team_id' => $awayTeam->id,
                'kickoff_at' => $kickoffAt,
            ],
            [
                'venue' => $matchData['venue'] ?? null,
                'status' => $matchData['status'] ?? 'scheduled',
                'score_home' => $matchData['score_home'] ?? null,
                'score_away' => $matchData['score_away'] ?? null,
                'tip_confidence' => $confidenceLevel,
            ]
        );
    }

    private static function processTips(MatchModel $match, array $tipsData, string $confidenceLevel): array
    {
        $createdTipIds = [];

        foreach ($tipsData as $tipType => $tipData) {
            if ($tipType === 'Over/Under' && is_array($tipData)) {
                $createdTipIds = array_merge($createdTipIds, self::processOverUnderTips($match, $tipData, $confidenceLevel));
            } else {
                $tipId = self::processStandardTip($match, $tipType, $tipData, $confidenceLevel);
                if ($tipId) {
                    $createdTipIds[] = $tipId;
                }
            }
        }

        return $createdTipIds;
    }

    private static function processOverUnderTips(MatchModel $match, array $tipData, string $confidenceLevel): array
    {
        $createdTipIds = [];

        foreach ($tipData as $threshold => $oddsInfo) {
            if (!is_array($oddsInfo) || empty($oddsInfo['odds'])) {
                continue;
            }

            foreach ($oddsInfo['odds'] as $pickIndex => $odd) {
                $tip = Tip::updateOrCreate(
                    [
                        'match_id' => $match->id,
                        'prediction_type' => 'Over/Under',
                        'prediction_value' => (int)filter_var($threshold, FILTER_SANITIZE_NUMBER_INT),
                        'pick_label' => $pickIndex === 0 ? "Over $threshold" : "Under $threshold",
                    ],
                    [
                        'odds' => $odd,
                        'risk_level' => self::mapRiskLevel($confidenceLevel),
                        'result' => self::mapResult($oddsInfo['result'] ?? 0),
                        'status' => 'settled'
                    ]
                );

                $createdTipIds[] = $tip->id;
                self::$statistics['new_tips']++;
            }
        }

        return $createdTipIds;
    }

    private static function processStandardTip(MatchModel $match, string $tipType, array $tipData, string $confidenceLevel): ?int
    {
        if (empty($tipData['odds'])) {
            return null;
        }

        $predictionValue = self::mapPredictionValue($tipType, $tipData['result'] ?? 0);
        if (!$predictionValue) {
            return null;
        }

        $tip = Tip::updateOrCreate(
            [
                'match_id' => $match->id,
                'prediction_type' => $tipType,
                'pick_label' => $predictionValue,
            ],
            [
                'prediction_value' => $tipData['result'] ?? 0,
                'risk_level' => self::mapRiskLevel($confidenceLevel),
                'is_free' => 0,
                'free_for_date' => now(),
            ]
        );

        self::$statistics['new_tips']++;
        return $tip->id;
    }

    private static function loadTipsToPlan(array $tipIds, string $confidenceLevel, array $matchData): void
    {
        $planRules = self::getPlanRules();
        $jackpotTag = $matchData['jackpot'] ?? null;
        $updatedPlans = [];

        foreach ($planRules as $rule) {
            $plan = SubscriptionPlan::where('name', $rule['plan_name'])->first();

            if (!$plan || !self::shouldIncludeBasedOnTags($rule['tags'], $jackpotTag)) {
                continue;
            }

            $features = $plan->features ?? [];
            $currentTipsList = $features['tips_list'] ?? [];
            $maxTips = ($rule['max_number_of_tips'] === '-') ? PHP_INT_MAX : (int)$rule['max_number_of_tips'];
            $eligibleTipIds = self::filterTipsByType($tipIds, $rule['tips_type']);

            $addedTips = self::addTipsToList($currentTipsList, $eligibleTipIds, $maxTips);

            if ($addedTips > 0) {
                $features['tips_list'] = array_values($currentTipsList);
                $plan->update(['features' => $features]);
                $updatedPlans[] = $rule['plan_name'];

                Log::info('Updated subscription plan with new tips', [
                    'plan_name' => $rule['plan_name'],
                    'added_tips' => $addedTips,
                    'total_tips' => count($currentTipsList),
                    'match' => $matchData['match'] ?? 'Unknown'
                ]);
            }
        }

        self::$statistics['plans_updated'] = array_unique(array_merge(
            self::$statistics['plans_updated'],
            $updatedPlans
        ));
    }

    private static function addTipsToList(array &$currentTipsList, array $eligibleTipIds, int $maxTips): int
    {
        $addedTips = 0;

        foreach ($eligibleTipIds as $tipId) {
            if (in_array($tipId, $currentTipsList) || count($currentTipsList) >= $maxTips) {
                continue;
            }

            $currentTipsList[] = $tipId;
            $addedTips++;
        }

        return $addedTips;
    }

    private static function getPlanRules(): array
    {
        return Cache::remember('subscription_plan_rules', 3600, function() {
            return [
                ['plan_name' => 'Full Time Scores Daily', 'max_number_of_tips' => '15', 'tips_type' => '1_X_2', 'tags' => '-'],
                ['plan_name' => 'Full Time Scores Weekly', 'max_number_of_tips' => '17', 'tips_type' => '1_X_2', 'tags' => '-'],
                ['plan_name' => 'Over/Under Market Daily', 'max_number_of_tips' => '5', 'tips_type' => 'Over/Under', 'tags' => '-'],
                ['plan_name' => 'Over/Under Market Weekly', 'max_number_of_tips' => '7', 'tips_type' => 'Over/Under', 'tags' => '-'],
                ['plan_name' => 'Sport Pesa Mega Jackpot', 'max_number_of_tips' => '-', 'tips_type' => '1_X_2', 'tags' => 'SPMJ'],
                ['plan_name' => 'Sport Pesa Mid Week Jackpot', 'max_number_of_tips' => '-', 'tips_type' => '1_X_2', 'tags' => 'SPMWJ'],
                ['plan_name' => 'Mozzart daily jackpot', 'max_number_of_tips' => '-', 'tips_type' => '1_X_2', 'tags' => 'MDJP'],
                ['plan_name' => 'Mozzart weekly jackpot', 'max_number_of_tips' => '-', 'tips_type' => '1_X_2', 'tags' => 'MWJP'],
                ['plan_name' => 'Odi bets weekly jackpot', 'max_number_of_tips' => '-', 'tips_type' => '1_X_2', 'tags' => 'OBWJ'],
                ['plan_name' => 'Double Chances Daily', 'max_number_of_tips' => '15', 'tips_type' => '1X_X2_12', 'tags' => '-'],
                ['plan_name' => 'Double Chances Weekly', 'max_number_of_tips' => '17', 'tips_type' => '1X_X2_12', 'tags' => '-'],
                ['plan_name' => 'Goal-No Goal Daily', 'max_number_of_tips' => '5', 'tips_type' => 'GG_NG', 'tags' => '-'],
                ['plan_name' => 'Goal-No Goal Weekly', 'max_number_of_tips' => '7', 'tips_type' => 'GG_NG', 'tags' => '-'],
            ];
        });
    }

    private static function shouldIncludeBasedOnTags(string $ruleTags, ?string $matchJackpotTag): bool
    {
        return $ruleTags === '-' || ($matchJackpotTag && $ruleTags === $matchJackpotTag);
    }

    private static function filterTipsByType(array $tipIds, string $allowedTipType): array
    {
        if (empty($tipIds)) {
            return [];
        }

        return Tip::whereIn('id', $tipIds)
            ->where('prediction_type', $allowedTipType)
            ->pluck('id')
            ->toArray();
    }

    private static function mapRiskLevel(string $confidenceLevel): string
    {
        return match ($confidenceLevel) {
            'max' => 'high',
            'avg' => 'mid',
            'min' => 'low',
            default => 'unknown',
        };
    }

    private static function mapPredictionValue(string $tipType, int $result): ?string
    {
        return match ($tipType) {
            '1X_X2_12' => match ($result) {
                1 => '1X',
                0 => 'X2',
                -1 => '12',
                default => null,
            },
            '1_X_2' => match ($result) {
                1 => '1',
                0 => 'x',
                -1 => '2',
                default => null,
            },
            'GG_NG' => match ($result) {
                -1 => 'GG',
                1 => 'NG',
                default => null,
            },
            default => null,
        };
    }

    private static function mapResult(int $result): string
    {
        return match ($result) {
            1 => 'win',
            0 => 'draw',
            -1 => 'lose',
            default => 'pending',
        };
    }
}
