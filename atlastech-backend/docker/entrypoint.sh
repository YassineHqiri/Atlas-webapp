#!/bin/sh
set -e

# Run migrations (ensure APP_KEY and DB_* are set in environment)
php artisan migrate --force

# Clear and cache config
php artisan config:cache
php artisan route:cache

# Start PHP-FPM in background, then nginx in foreground
php-fpm &
nginx -g "daemon off;"
