<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('subject',160);
            $table->enum('status', ['open','pending','closed'])->default('open');
            $table->enum('priority', ['low','normal','high'])->default('normal');
            $table->timestamps();
        });

        Schema::create('support_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('support_tickets')->cascadeOnDelete();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('sender_role', ['user','admin']);
            $table->text('message');
            $table->json('attachments')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['ticket_id','created_at']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('support_messages');
        Schema::dropIfExists('support_tickets');
    }
};
