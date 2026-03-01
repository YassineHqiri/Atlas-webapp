<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('ADMIN_SEED_PASSWORD');
        if (empty($password)) {
            $password = Str::random(20);
            $this->command->warn('ADMIN_SEED_PASSWORD not set. Generated temporary password: ' . $password);
            $this->command->warn('Set ADMIN_SEED_PASSWORD in .env and re-run db:seed for production.');
        }

        User::updateOrCreate(
            ['email' => 'admin@atlastech.com'],
            [
                'name' => 'Admin User',
                'password' => $password,
                'role' => 'super_admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'manager@atlastech.com'],
            [
                'name' => 'Manager',
                'password' => $password,
                'role' => 'admin',
            ]
        );
    }
}
