<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Ensure admin exists and stays "active" (no status column, so we just keep it present)
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name'        => 'Admin',
                'last_name'         => 'User',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'last_login_at'     => null,
                'phone'             => null,
                'remember_token'    => Str::random(10),
            ]
        );

        // Attach admin role if available
        if (class_exists(Role::class)) {
            if ($adminRole = Role::where('name', 'admin')->first()) {
                $admin->roles()->syncWithoutDetaching([$adminRole->id]);
            }
        }

        // 2) Create 9 regular users (total 10 including admin)
        $people = [
            ['Ava',     'Kamau'],
            ['Brian',   'Otieno'],
            ['Cynthia', 'Njeri'],
            ['David',   'Mwangi'],
            ['Esther',  'Wanjiru'],
            ['Felix',   'Mutiso'],
            ['Grace',   'Chebet'],
            ['Hassan',  'Ouma'],
            ['Irene',   'Muthoni'],
        ];

        foreach ($people as $i => [$first, $last]) {
            $email = strtolower($first) . '.' . strtolower($last) . '@example.com';

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'first_name'        => $first,
                    'last_name'         => $last,
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'last_login_at'     => null,
                    'phone'             => null,
                    'remember_token'    => Str::random(10),
                ]
            );

            // Attach "user" role if available
            if (class_exists(Role::class)) {
                if ($userRole = Role::where('name', 'user')->first()) {
                    $user->roles()->syncWithoutDetaching([$userRole->id]);
                }
            }
        }
    }
}
