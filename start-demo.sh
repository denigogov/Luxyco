#!/bin/sh
set -e

echo "Starting MariaDB (demo DB inside container)..."

# Runtime dirs
mkdir -p /run/mysqld /var/lib/mysql
chown -R mysql:mysql /run/mysqld /var/lib/mysql

# Init DB if empty
if [ ! -d "/var/lib/mysql/mysql" ]; then
  echo "Initializing database (first boot)..."
  mariadb-install-db --user=mysql --datadir=/var/lib/mysql >/dev/null

  # Start temp mysqld for initialization
  mysqld --user=mysql --datadir=/var/lib/mysql --bind-address=127.0.0.1 --port=3306 &
  pid="$!"

  # Wait until ready
  until mariadb-admin ping -h 127.0.0.1 -P 3306 --silent; do
    sleep 1
  done

  echo "Creating database and user..."
  mariadb -h 127.0.0.1 -P 3306 <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL

  # Stop temp mysqld
  kill "$pid"
  wait "$pid" || true
fi

# Start mysqld for real (background)
mysqld --user=mysql --datadir=/var/lib/mysql --bind-address=127.0.0.1 --port=3306 &
dbpid="$!"

until mariadb-admin ping -h 127.0.0.1 -P 3306 --silent; do
  sleep 1
done

echo "Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "Starting Nest..."
exec node dist/main
