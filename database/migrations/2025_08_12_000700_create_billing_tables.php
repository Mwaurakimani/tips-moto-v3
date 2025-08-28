<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->decimal('price', 9, 2);
            $table->char('currency', 3)->default('USD');
            $table->enum('interval', ['day','week','month','year']);
            $table->smallInteger('interval_count')->default(1);
            $table->smallInteger('trial_days')->default(0);
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained('subscription_plans')->restrictOnDelete();
            $table->enum('status', ['trialing','active','past_due','canceled','expired'])->default('active');
            $table->dateTime('start_at');
            $table->dateTime('end_at')->nullable();
            $table->dateTime('renews_at')->nullable();
            $table->dateTime('cancel_at')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->string('gateway', 50)->nullable();
            $table->string('gateway_customer_id', 120)->nullable();
            $table->string('gateway_subscription_id', 120)->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->index(['user_id','status']);
            $table->unique('gateway_subscription_id');
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('type', ['subscription','tip_purchase','deposit','withdrawal','refund','charge']);
            $table->decimal('amount', 11, 2);
            $table->char('currency', 3)->default('USD');
            $table->enum('status', ['pending','completed','failed','refunded','canceled']);
            $table->string('provider', 50)->nullable();
            $table->string('provider_ref', 191)->nullable()->unique();
            $table->string('description', 255)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['user_id','status','created_at']);
        });

        Schema::create('tip_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('tip_id')->constrained('tips')->cascadeOnDelete();
            $table->foreignId('transaction_id')->constrained('transactions')->restrictOnDelete();
            $table->decimal('price', 9, 2);
            $table->char('currency', 3)->default('USD');
            $table->enum('status', ['pending','paid','refunded','failed'])->default('paid');
            $table->timestamps();
            $table->unique(['user_id','tip_id']);
        });

        Schema::create('tip_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('tip_id')->constrained('tips')->cascadeOnDelete();
            $table->enum('source', ['subscription','purchase','promo','free']);
            $table->dateTime('granted_at');
            $table->dateTime('expires_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id','tip_id']);
        });

        Schema::create('promo_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 40)->unique();
            $table->enum('discount_type', ['amount','percent']);
            $table->decimal('discount_value', 9, 2);
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('times_redeemed')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('promo_redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promo_code_id')->constrained('promo_codes')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
        });
    }
    public function down(): void {
        Schema::dropIfExists('promo_redemptions');
        Schema::dropIfExists('promo_codes');
        Schema::dropIfExists('tip_access');
        Schema::dropIfExists('tip_purchases');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('subscription_plans');
    }
};
