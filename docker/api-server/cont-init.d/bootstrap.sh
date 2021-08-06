#!/usr/bin/with-contenv sh

set -e

DB_URL=${DB_HOST:-127.0.0.1}:${DB_PORT:-3306}

echo "Waiting for MySQL at $DB_URL"
wait-for $DB_URL -t 60 -q -- echo OK

php artisan migrate --force
php artisan optimize
