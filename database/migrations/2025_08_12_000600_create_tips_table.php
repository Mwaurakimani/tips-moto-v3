<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('prediction_type', 40);
            $table->smallInteger('prediction_value');
            $table->string('pick_label', 20);
            $table->decimal('odds', 6, 2)->nullable();
            $table->string('bookmaker', 80)->nullable();
            $table->unsignedTinyInteger('confidence')->nullable();
            $table->enum('risk_level', ['low','mid','high'])->nullable();
            $table->boolean('is_free')->default(false);
            $table->date('free_for_date')->nullable();
            $table->enum('visibility', ['public','subscribers','purchased'])->default('subscribers');
            $table->dateTime('publish_at')->nullable();
            $table->enum('status', ['pending','settled'])->default('pending');
            $table->enum('result', ['pending','won','lost','void','canceled'])->default('pending');
            $table->dateTime('settled_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index('match_id');
            $table->index('publish_at');
            $table->index(['is_free','free_for_date']);
            $table->index(['status','result']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('tips');
    }
};
