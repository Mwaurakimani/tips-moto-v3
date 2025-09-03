<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tips_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tip_id')->constrained('tips')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('url', 191);
            $table->string('type', 20);
            $table->string('provider', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tips_media');
    }
};
