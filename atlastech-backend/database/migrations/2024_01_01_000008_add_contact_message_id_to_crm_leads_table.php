<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crm_leads', function (Blueprint $table) {
            $table->foreignId('contact_message_id')->nullable()->after('source')->constrained('contact_messages')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('crm_leads', function (Blueprint $table) {
            $table->dropForeign(['contact_message_id']);
        });
    }
};
