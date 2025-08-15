<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sports', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80)->unique();
            $table->timestamps();
        });

        Schema::create('leagues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sport_id')->constrained('sports')->restrictOnDelete();
            $table->string('name', 120);
            $table->string('country', 120)->nullable();
            $table->string('slug', 140)->unique();
            $table->timestamps();
            $table->index(['sport_id', 'name']);
        });

        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')->constrained('leagues')->cascadeOnDelete();
            $table->string('name', 140);
            $table->string('short_name', 32)->nullable();
            $table->string('country', 120)->nullable();
            $table->string('logo_url', 255)->nullable();
            $table->timestamps();
            $table->index(['league_id','name']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('teams');
        Schema::dropIfExists('leagues');
        Schema::dropIfExists('sports');
    }
};
