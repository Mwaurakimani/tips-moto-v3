<?php

namespace App\Http\Controllers;

use App\Models\League;
use App\Models\MatchModel;
use App\Models\Team;
use App\Models\Tip;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MatchController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'league' => 'required|string',
            'homeTeam' => 'required|string',
            'awayTeam' => 'required|string|different:homeTeam',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required',
            'venue' => 'nullable|string|max:160',
            'status' => 'nullable|in:scheduled,live,finished,postponed,canceled'
        ]);

        // Find or create league first
        $league = League::firstOrCreate(
            ['name' => $validated['league']],
            [
                'name' => $validated['league'],
            ]
        );

        // Find or create home team within this league
        $homeTeam = Team::firstOrCreate(
            [
                'name' => $validated['homeTeam'],
                'league_id' => $league->id
            ],
            [
                'name' => $validated['homeTeam'],
                'league_id' => $league->id,
                'short_name' => $this->generateShortName($validated['homeTeam']),
                'country' => null, // You can set a default or derive from league
                'logo_url' => null,
            ]
        );

        // Find or create away team within this league
        $awayTeam = Team::firstOrCreate(
            [
                'name' => $validated['awayTeam'],
                'league_id' => $league->id
            ],
            [
                'name' => $validated['awayTeam'],
                'league_id' => $league->id,
                'short_name' => $this->generateShortName($validated['awayTeam']),
                'country' => null, // You can set a default or derive from league
                'logo_url' => null,
            ]
        );

        // Parse the datetime
        $kickoffAt = Carbon::parse($validated['date'] . ' ' . $validated['time']);

        // Create the match using the IDs
        $match = MatchModel::create([
            'league_id' => $league->id,
            'home_team_id' => $homeTeam->id,
            'away_team_id' => $awayTeam->id,
            'kickoff_at' => $kickoffAt,
            'venue' => $validated['venue'] ?? null,
            'status' => $validated['status'] ?? 'scheduled',
        ]);

        // Return success response for Inertia
        return redirect()->back()->with('success', 'Match created successfully');
    }

    public function update(Request $request, MatchModel $match)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'league' => 'sometimes|required|string',
            'homeTeam' => 'sometimes|required|string',
            'awayTeam' => 'sometimes|required|string|different:homeTeam',
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required',
            'venue' => 'nullable|string|max:160',
            'status' => 'nullable|in:scheduled,live,finished,postponed,canceled'
        ]);

        // Only update fields that were provided
        $updateData = [];

        // Handle league update
        if (isset($validated['league'])) {
            $league = League::firstOrCreate(['name' => $validated['league']]);
            $updateData['league_id'] = $league->id;
        }

        // Handle home team update
        if (isset($validated['homeTeam'])) {
            $leagueId = $updateData['league_id'] ?? $match->league_id;
            $homeTeam = Team::firstOrCreate(
                ['name' => $validated['homeTeam'], 'league_id' => $leagueId],
                [
                    'name' => $validated['homeTeam'],
                    'league_id' => $leagueId,
                    'short_name' => $this->generateShortName($validated['homeTeam']),
                ]
            );
            $updateData['home_team_id'] = $homeTeam->id;
        }

        // Handle away team update
        if (isset($validated['awayTeam'])) {
            $leagueId = $updateData['league_id'] ?? $match->league_id;
            $awayTeam = Team::firstOrCreate(
                ['name' => $validated['awayTeam'], 'league_id' => $leagueId],
                [
                    'name' => $validated['awayTeam'],
                    'league_id' => $leagueId,
                    'short_name' => $this->generateShortName($validated['awayTeam']),
                ]
            );
            $updateData['away_team_id'] = $awayTeam->id;
        }

        // Handle datetime update
        if (isset($validated['date']) || isset($validated['time'])) {
            $date = $validated['date'] ?? $match->kickoff_at->format('Y-m-d');
            $time = $validated['time'] ?? $match->kickoff_at->format('g:i A');

            $updateData['kickoff_at'] = Carbon::parse($date . ' ' . $time);
        }

        // Handle other fields
        if (isset($validated['venue'])) {
            $updateData['venue'] = $validated['venue'];
        }

        if (isset($validated['status'])) {
            $updateData['status'] = $validated['status'];
        }

        // Update the match
        $match->update($updateData);

        // Return success response for Inertia
        return redirect()->back()->with('success', 'Match updated successfully');
    }

    public function addTip(Request $request, MatchModel $match)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'tipType' => 'required|string|max:40',
            'subType' => 'required|string|max:100',
            'value' => 'required|string|max:20',
            'prediction' => 'required|string|max:255',
            'riskLevel' => 'required|in:low,mid,high',
            'winningStatus' => 'required|in:pending,won,lost,void,canceled',
            'free' => 'required|boolean',
        ]);

        // Map frontend values to database structure
        $predictionValue = $this->mapPredictionValue($validated['tipType'], $validated['value']);
        $predictionType = $this->mapPredictionType($validated['subType']);

        // Create the tip
        $tip = Tip::create([
            'match_id' => $match->id,
            'author_id' => auth()->id(), // Set to current user, or null if no auth
            'prediction_type' => $predictionType,
            'prediction_value' => $predictionValue,
            'pick_label' => $validated['value'],
            'odds' => null, // Can be added later
            'bookmaker' => null, // Can be added later
            'confidence' => null, // Can be added later
            'risk_level' => $validated['riskLevel'],
            'is_free' => $validated['free'],
            'free_for_date' => $validated['free'] ? now()->toDateString() : null,
            'visibility' => 'subscribers', // Default visibility
            'publish_at' => null, // Can be set later
            'status' => 'pending',
            'result' => $validated['winningStatus'],
            'settled_at' => null,
            'notes' => null,
        ]);

        // Return success with the created tip
        return redirect()->back()->with([
            'success' => 'Tip added successfully',
            'newTip' => [
                'id' => $tip->id,
                'match_id' => $tip->match_id,
                'prediction_type' => $tip->prediction_type,
                'pick_label' => $tip->pick_label,
                'risk_level' => $tip->risk_level,
                'is_free' => $tip->is_free,
                'result' => $tip->result,
                'tipType' => $validated['tipType'],
                'subType' => $validated['subType'],
                'value' => $validated['value'],
                'prediction' => $validated['prediction'],
                'winningStatus' => $validated['winningStatus'],
                'free' => $validated['free'],
            ]
        ]);
    }

    public function deleteTip(Tip $tip)
    {
        try {
            // Delete the tip
            $tip->delete();

            return redirect()->back()->with('success', 'Tip deleted successfully');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete tip');
        }
    }

    public function updateTip(Request $request, Tip $tip)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'tipType' => 'required|string|max:40',
            'subType' => 'required|string|max:100',
            'value' => 'required|string|max:20',
            'prediction' => 'required|string|max:255',
            'riskLevel' => 'required|in:low,mid,high',
            'winningStatus' => 'required|in:pending,won,lost,void,canceled',
            'free' => 'required|boolean',
        ]);

        // Map frontend values to database structure
        $predictionValue = $this->mapPredictionValue($validated['tipType'], $validated['value']);
        $predictionType = $this->mapPredictionType($validated['subType']);

        // Update the tip
        $tip->update([
            'prediction_type' => $predictionType,
            'prediction_value' => $predictionValue,
            'pick_label' => $validated['value'],
            'risk_level' => $validated['riskLevel'],
            'is_free' => $validated['free'],
            'free_for_date' => $validated['free'] ? now()->toDateString() : null,
            'result' => $validated['winningStatus'],
            'settled_at' => in_array($validated['winningStatus'], ['won', 'lost', 'void']) ? now() : null,
            'status' => in_array($validated['winningStatus'], ['won', 'lost', 'void']) ? 'settled' : 'pending',
        ]);

        return redirect()->back()->with('success', 'Tip updated successfully');
    }

    /**
     * Map frontend prediction types to database prediction types
     */
    private function mapPredictionType($subType): string
    {
        return match ($subType) {
            '1 X 2' => '1_X_2',
            'Double Chance' => '1X_X2_12',
            'Goals' => 'Over/Under',
            'Both Teams Score' => 'GG_NG',
            default => $subType,
        };
    }

    /**
     * Map frontend values to database prediction values
     */
    private function mapPredictionValue($tipType, $value): int
    {
        // For 1X2 markets
        if (in_array($tipType, ['1', 'X', '2'])) {
            return match ($tipType) {
                '1' => 1,
                'X' => 0,
                '2' => -1,
                default => 0,
            };
        }

        // For Double Chance markets
        if (in_array($tipType, ['1X', '12', 'X2'])) {
            return match ($tipType) {
                '1X' => 1,
                'X2' => 0,
                '12' => -1,
                default => 0,
            };
        }

        // For BTTS markets
        if (in_array($tipType, ['GG', 'NG'])) {
            return match ($tipType) {
                'GG' => -1,
                'NG' => 1,
                default => 0,
            };
        }

        // For Over/Under goals
        if (str_contains($tipType, 'Over') || str_contains($tipType, 'Under')) {
            // Extract the number from strings like "Over 2.5" or "Under 1.5"
            preg_match('/(\d+\.?\d*)/', $tipType, $matches);
            $threshold = $matches[1] ?? 0;

            return (int)((float)$threshold * 10); // Store as integer (25 for 2.5, 15 for 1.5)
        }

        return 0; // Default value
    }
    private function generateShortName($teamName): string
    {
        // Simple logic to generate short name
        $words = explode(' ', $teamName);

        if (count($words) === 1) {
            // Single word: take first 3-4 characters
            return strtoupper(substr($teamName, 0, 3));
        } else {
            // Multiple words: take first letter of each word, max 3-4 letters
            $shortName = '';
            foreach (array_slice($words, 0, 4) as $word) {
                $shortName .= strtoupper(substr($word, 0, 1));
            }
            return $shortName;
        }
    }
}



