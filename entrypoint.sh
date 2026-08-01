#!/bin/bash
set -e

# Ensure SQLite database exists
mkdir -p database
touch database/database.sqlite

# Start Laravel server immediately in background so PORT is bound in 0.1s
php artisan serve --host=0.0.0.0 --port=${PORT:-8000} &
SERVER_PID=$!

# Run storage link, migrations and seeders in background without blocking port
(
  sleep 1
  php artisan storage:link || true
  php artisan migrate:fresh --force --seed || true
) &

# Wait for server process
wait $SERVER_PID
