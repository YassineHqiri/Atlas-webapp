<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });

        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'super_admin', 'customer') DEFAULT 'customer'");
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'super_admin') DEFAULT 'admin'");
    }
};
