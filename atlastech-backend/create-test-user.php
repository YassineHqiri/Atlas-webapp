<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

// Create new admin user
$user = User::create([
    'name' => 'Test Admin User',
    'email' => 'testadmin@atlastech.com',
    'password' => bcrypt('TestPassword123'),
    'role' => 'admin',
]);

echo "✅ User created successfully!\n\n";
echo "Email: testadmin@atlastech.com\n";
echo "Password: TestPassword123\n";
echo "Role: admin\n";
echo "\nUse this to log in at: http://localhost:3000/admin/login\n";
