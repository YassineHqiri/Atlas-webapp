<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->enum('status', ['new', 'contacted', 'qualified', 'won', 'lost'])->default('new');
            $table->enum('source', ['manual', 'contact_form'])->default('manual');
            $table->string('service_interest')->nullable();
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_leads');
    }
};
