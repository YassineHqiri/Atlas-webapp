<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            // Ajouter colonne langue si elle n'existe pas
            if (!Schema::hasColumn('faqs', 'language')) {
                $table->enum('language', ['fr', 'en'])->default('fr')->after('id');
                $table->index('language');
            }
        });
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            if (Schema::hasColumn('faqs', 'language')) {
                $table->dropColumn('language');
            }
        });
    }
};
