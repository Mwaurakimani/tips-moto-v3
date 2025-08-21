<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('adminDashboard/accounts', function () {
        // Fetch users with roles (if you have a roles table; adjust as needed)
        $users = User::with('roles') // assume relation exists
        ->orderByDesc('created_at')
            ->get()
            ->map(function ($user) {
                // Get the last role assigned or default to 'User'
                $role = $user->roles->last()?->name ?? 'User';

                return [
                    'id' => $user->id,
                    'user' => "{$user->first_name} {$user->last_name}",
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $role,
                    'dateJoined' => $user->created_at?->format('m/d/Y') ?? null,
                    'dateObject' => $user->created_at,
                ];
            });

        return Inertia::render('AdminDashboardSystem/Accounts', [
            'currentPageTitle' => 'Accounts',
            'accounts' => $users,
        ]);
    })->name('adminDashboard.accounts');
});


