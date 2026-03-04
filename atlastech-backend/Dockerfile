# Build stage - install dependencies
FROM composer:2.7 AS composer
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize

# Production stage
FROM php:8.2-fpm-alpine
WORKDIR /var/www/html

# Install system deps and PHP extensions
RUN apk add --no-cache \
    nginx \
    mysql-client \
    libpng-dev \
    oniguruma-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip opcache

# Nginx config
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy app from composer stage
COPY --from=composer /app /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Entrypoint: run migrations, then start services
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
