#!/bin/sh
set -e

echo "=== Starting AtlasTech Backend ==="

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear cache
echo "Clearing cache..."
php artisan cache:clear
php artisan config:clear

echo "=== Backend Ready ==="

# Start PHP-FPM in background
php-fpm &

# Start nginx
nginx -g "daemon off;"
