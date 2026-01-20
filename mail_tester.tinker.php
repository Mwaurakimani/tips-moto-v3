<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;


$user = User::where('email', 'kimmwaus@gmail.com')->first();

dd($user);

echo "=== User Info ===\n";
dump([
    'email' => $user->email,
    'first_name' => $user->first_name,
    'has_sendPasswordResetNotification' => method_exists($user, 'sendPasswordResetNotification'),
]);

echo "\n=== Clearing Previous Tokens ===\n";
DB::table('password_reset_tokens')->where('email', $user->email)->delete();
echo "Cleared\n";

echo "\n=== Sending Password Reset Link ===\n";
$response = Password::sendResetLink(['email' => $user->email]);
echo "Response: ";
dump($response);

echo "\n=== Token in Database ===\n";
$token = DB::table('password_reset_tokens')->where('email', $user->email)->first();
dump($token);

echo "\n=== Sending Notification Directly ===\n";
try {
    $tokenValue = $token->token ?? 'no-token';
    $user->sendPasswordResetNotification($tokenValue);
    echo "Notification sent successfully\n";
} catch (\Exception $e) {
    echo "Error: ";
    dump($e->getMessage());
    dump($e->getTraceAsString());
}

echo "\n=== Checking Laravel Logs ===\n";
$logFile = storage_path('logs/laravel.log');
if (file_exists($logFile)) {
    $logs = shell_exec("tail -50 \"$logFile\" 2>&1");
    echo $logs;
} else {
    echo "Log file not found\n";
}
