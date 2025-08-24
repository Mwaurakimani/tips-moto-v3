<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ledgers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade'); // if user is deleted, remove their transactions too
            $table->string('type'); // e.g., Deposit, Withdrawal
            $table->decimal('amount', 15, 2); // Supports large amounts with 2 decimal places
            $table->string('status'); // e.g., Completed, Pending, Failed
            $table->date('date'); // Transaction date
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ledgers');
    }
};
