<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Sport;
use App\Models\League;
use App\Models\Team;
use App\Models\MatchModel; // avoid PHP 8 match() keyword confusion
use App\Models\Tip;

class SportsSeeder extends Seeder
{
    public function run(): void
    {
        $tz   = config('app.timezone', 'Africa/Nairobi');
        $now  = Carbon::now($tz);
        $from = $now->copy()->subDays(3);                 // 3 days ago (any time)
        $to   = $now->copy()->addDay()->setTime(21, 0);   // tomorrow 9:00 PM

        // --- 1) Base taxonomy ---
        $football = Sport::firstOrCreate(['name' => 'Football']);

        $league = League::firstOrCreate(
            ['sport_id' => $football->id, 'slug' => 'premier-league'],
            ['name' => 'Premier League', 'country' => 'England']
        );

        // Expandable team list (add more as needed)
        $teamNames = [
            'Arsenal','Chelsea','Liverpool','Manchester City','Manchester United','Tottenham',
            'Newcastle','Aston Villa','Brighton','West Ham','Everton','Leicester City',
            'Wolves','Crystal Palace','Brentford','Fulham','Bournemouth','Nottingham Forest',
            'Leeds United','Southampton',
        ];

        $teams = [];
        foreach ($teamNames as $name) {
            $teams[] = Team::firstOrCreate(['league_id' => $league->id, 'name' => $name]);
        }

        // --- 2) Fill up to 100 matches total ---
        $targetMatches = 100;
        $currentCount  = MatchModel::count();
        $toCreate      = max(0, $targetMatches - $currentCount);
        if ($toCreate === 0) {
            $this->command?->info("Already have {$currentCount} matches. Skipping creation.");
            $toCreate = 0;
        }

        if ($toCreate > 0) {
            // Generate evenly spaced datetimes from $to to $from (descending)
            $spanMinutes = $to->diffInMinutes($from); // positive
            $step = $toCreate > 1 ? intdiv(max($spanMinutes, 1), ($toCreate - 1)) : $spanMinutes;

            DB::transaction(function () use ($toCreate, $to, $step, $teams, $league, $now, $tz) {
                for ($i = 0; $i < $toCreate; $i++) {
                    $kickoffAt = $to->copy()->subMinutes($i * $step);

                    // Pick two distinct teams
                    /** @var \App\Models\Team $home */
                    /** @var \App\Models\Team $away */
                    $home = Arr::random($teams);
                    do { $away = Arr::random($teams); } while ($away->id === $home->id);

                    // Decide match status based on time
                    $status = 'scheduled';
                    if ($kickoffAt->lt($now->copy()->subHours(2))) {
                        $status = 'finished';
                    } elseif ($kickoffAt->between($now->copy()->subHours(2), $now->copy()->addHours(2))) {
                        $status = 'live';
                    }

                    // Create match
                    $match = MatchModel::create([
                        'league_id'  => $league->id,
                        'home_team_id' => $home->id,
                        'away_team_id' => $away->id,
                        'kickoff_at' => $kickoffAt->toDateTimeString(),
                        'venue'      => null,
                        'status'     => $status,
                        'score_home' => $status === 'finished' ? rand(0, 4) : null,
                        'score_away' => $status === 'finished' ? rand(0, 4) : null,
                    ]);

                    // --- 3) Seed 1–3 tips for the match ---
                    $tipCount = rand(1, 3);
                    $today    = Carbon::now($tz)->toDateString();
                    $isToday  = $kickoffAt->isSameDay(Carbon::now($tz));

                    // ensure at least one free tip on today's matches
                    $freeAssigned = false;

                    for ($t = 0; $t < $tipCount; $t++) {
                        $predictionType = Arr::random(['1_X_2', '1X_X2_12', 'GG_NG']);

                        // Build a consistent prediction value + label
                        switch ($predictionType) {
                            case '1_X_2':
                                $valueOptions = [-1, 0, 1]; // 2, X, 1
                                $value = Arr::random($valueOptions);
                                $label = $value === 1 ? '1' : ($value === 0 ? 'X' : '2');
                                break;

                            case '1X_X2_12':
                                $valueOptions = [-1, 0, 1]; // 1/2, X/2, 1/X (your encoding)
                                $value = Arr::random($valueOptions);
                                $label = $value === 1 ? '1/X' : ($value === 0 ? 'X/2' : '1/2');
                                break;

                            case 'GG_NG':
                            default:
                                $valueOptions = [-1, 1]; // GG, NG
                                $value = Arr::random($valueOptions);
                                $label = $value === -1 ? 'GG' : 'NG';
                                break;
                        }

                        // Stats
                        $odds       = round(mt_rand(150, 350) / 100, 2); // 1.50 - 3.50
                        $confidence = rand(65, 90);
                        $riskLevel  = $confidence >= 82 ? 'low' : ($confidence >= 72 ? 'mid' : 'high');

                        // Free today?
                        $isFree       = false;
                        $freeForDate  = null;
                        $visibility   = 'subscribers';

                        if ($isToday && !$freeAssigned) {
                            $isFree      = true;
                            $freeForDate = $today;
                            $visibility  = 'public';
                            $freeAssigned = true;
                        }

                        Tip::create([
                            'match_id'         => $match->id,
                            'author_id'        => null,
                            'prediction_type'  => $predictionType,
                            'prediction_value' => $value,
                            'pick_label'       => $label,
                            'odds'             => $odds,
                            'bookmaker'        => null,
                            'confidence'       => $confidence,
                            'risk_level'       => $riskLevel,
                            'is_free'          => $isFree ? 1 : 0,
                            'free_for_date'    => $freeForDate,
                            'visibility'       => $visibility,
                            'publish_at'       => min($now, $kickoffAt)->toDateTimeString(),
                            'status'           => $status === 'finished' ? 'settled' : 'pending',
                            'result'           => $status === 'finished' ? Arr::random(['won','lost','void']) : 'pending',
                            'settled_at'       => $status === 'finished' ? $kickoffAt->copy()->addHours(2) : null,
                            'notes'            => null,
                        ]);
                    }
                }
            });
        }

        $this->command?->info("Sports + league + teams ready. Added {$toCreate} matches spanning {$from->toDateTimeString()} to {$to->toDateTimeString()} (tz: {$tz}). Today's matches include free tips.");
    }
}
