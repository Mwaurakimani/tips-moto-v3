<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')->constrained('leagues')->cascadeOnDelete();
            $table->foreignId('home_team_id')->constrained('teams');
            $table->foreignId('away_team_id')->constrained('teams');
            $table->dateTime('kickoff_at');
            $table->string('venue', 160)->nullable();
            $table->enum('status', ['scheduled','live','finished','postponed','canceled'])->default('scheduled');
            $table->unsignedTinyInteger('score_home')->nullable();
            $table->unsignedTinyInteger('score_away')->nullable();
            $table->timestamps();
            $table->index(['league_id','kickoff_at']);
            $table->index(['status','kickoff_at']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('matches');
    }
};
