<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            // name, slug, currency, tips, period(days), price, tax, category/description
            ['Full Time Scores Daily',     'full-time-scores-daily',     'ksh', 15, 2,  99.00,  1.00, 'match'],
            ['Full Time Scores Weekly',    'full-time-scores-weekly',    'ksh', 17, 9, 599.00,  9.00, 'match'],
            ['Over/Under Market Daily',    'over-under-market-daily',    'ksh',  5, 1,  29.00,  1.00, 'over-under'],
            ['Over/Under Market Weekly',   'over-under-market-weekly',   'ksh',  9, 3, 199.00,  3.00, 'over-under'],
            ['Sport Pesa Mega Jackpot',    'sport-pesa-mega-jackpot',    'ksh',  1, 1,  49.00,  1.00, 'jackpot'],
            ['Sport Pesa Mid Week Jackpot','sport-pesa-mid-week-jackpot','ksh', 15, 1,  49.00,  1.00, 'jackpot'],
            ['Mozzart daily jackpot',      'mozzart-daily-jackpot',      'ksh', 20, 1,  39.00,  1.00, 'jackpot'],
            ['Mozzart weekly jackpot',     'mozzart-weekly-jackpot',     'ksh', 16, 1,  29.00,  1.00, 'jackpot'],
            ['Odi bets weekly jackpot',    'odi-bets-weekly-jackpot',    'ksh', 10, 1,  29.00,  1.00, 'jackpot'],
            ['Double Chances Daily',       'double-chances-daily',       'ksh', 15, 2,  99.00,  1.00, 'match'],
            ['Double Chances Weekly',      'double-chances-weekly',      'ksh', 17, 2, 599.00, 10.00, 'match'],
            ['Goal-No Goal Daily',         'goal-no-goal-daily',         'ksh',  5, 2,  29.00,  1.00, 'match'],
            ['Goal-No Goal Weekly',        'goal-no-goal-weekly',        'ksh',  7, 1, 199.00, 10.00, 'match'],
        ];

        foreach ($plans as [$name, $slug, $currency, $tips, $periodDays, $price, $tax, $category]) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $slug],
                [
                    'name'            => $name,
                    'price'           => $price,
                    'currency'        => $currency,     // 'ksh' per your data
                    // Map numeric "period" to duration using day-based interval
                    'interval'        => 'day',
                    'interval_count'  => (int) $periodDays,
                    'trial_days'      => 0,
                    'is_active'       => true,
                    // Store extra fields in features JSON
                    'features'        => [
                        'category'     => $category,
                        'tips'         => (int) $tips,
                        'period_days'  => (int) $periodDays,
                        'tax'          => (float) $tax,
                        'label'        => $name,
                    ],
                ]
            );
        }
    }
}
