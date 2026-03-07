#!/bin/sh

# Start PHP-FPM in background
php-fpm &

# Start nginx
nginx -g "daemon off;"
