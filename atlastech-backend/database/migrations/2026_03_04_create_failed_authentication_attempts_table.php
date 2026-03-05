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
        Schema::create('failed_authentication_attempts', function (Blueprint $table) {
            $table->id();
            $table->string('identifier', 100); // Reduced length for indexing
            $table->string('type', 20)->default('login'); // Reduced length for indexing
            $table->string('ip_address', 45)->nullable(); // IPv6 compatible
            $table->string('user_agent', 255)->nullable();
            $table->text('reason');
            $table->boolean('is_blocked')->default(false);
            $table->timestamp('blocked_until')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index('identifier');
            $table->index('ip_address');
            $table->index('type');
            $table->index('blocked_until');
            // Custom unique index with limited key length
            $table->index(['identifier', 'type'], 'idx_identifier_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('failed_authentication_attempts');
    }
};
