<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->char('name', 50);
            $table->char('lastname', 50)->nullable();
            $table->char('email', 50)->unique();
            $table->date('birthdate')->nullable();
            $table->char('DNI', 9)->unique()->nullable();
            $table->enum('hardSkill', ['Frontend', 'Backend', 'Design', 'Analyst', 'Full Stack', 'Others'])->default('Others');
            $table->string('password')->nullable();
            $table->enum('role', ['admin', 'user'])->default('user');
            $table->string('profile_picture')->nullable();
            $table->enum('status', ['Review', 'Interview', 'hired', 'Rejected'])->default('Review');
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_active')->default(true);

            $table->string('google_id')->nullable();
            $table->string('github_id')->nullable();
            $table->string('linkedin_id')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
    }
};
