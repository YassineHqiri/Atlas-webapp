<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = config('app.admin_seed_password') ?? env('ADMIN_SEED_PASSWORD');
        
        if (empty($password)) {
            $password = 'admin123'; // Default password
            $this->command->warn('ADMIN_SEED_PASSWORD not set. Using default password: admin123');
        }

        User::updateOrCreate(
            ['email' => 'admin@atlastech.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make($password),
                'role' => 'super_admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'manager@atlastech.com'],
            [
                'name' => 'Manager',
                'password' => Hash::make($password),
                'role' => 'admin',
            ]
        );
        
        $this->command->info('Admin users seeded successfully with password: ' . $password);
    }
}
