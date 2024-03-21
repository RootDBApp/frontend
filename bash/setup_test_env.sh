#!/usr/bin/env bash

declare rdb_dir="/home/share/Developpements/spo-ijaz/rootdb"

cd "${rdb_dir}/frontend" || exit

echo "#"
echo "# Compile prod build..."
echo "#"
docker exec -u node -it dev-rootdb-frontend-react npm run build

echo "#"
echo "# Seed DB with prod data..."
echo "#"
docker exec -u rootdb -it dev-rootdb-api php artisan db:wipe --force -n && mysql -u root -pthee1uuWiechieneiyieZ0aif3aefe -h 172.20.0.50 rootdb-api </home/share/Developpements/spo-ijaz/api/storage/app/seeders/production/seeder_init.sql

echo "#"
echo "# Install \"serve\" if not installed..."
echo "#"
docker exec -u root -it dev-rootdb-frontend-react yarn global add serve

echo "#"
echo "# Copy test app-config.js into build directory...."
echo "#"
cp -f "${rdb_dir}/frontend/doc/app-config.js" "${rdb_dir}/frontend/build"

echo "#"
echo "# Serve Prod build..."
echo "#"
docker exec -d -u node -it dev-rootdb-frontend-react serve -s build

echo "#"
echo "# # Start Cypress..."
echo "#"
yarn run cypress:open
