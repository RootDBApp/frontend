#!/usr/bin/env bash

declare rdb_dir="/home/share/Developpements/www/rootdb"
if [[ $(hostname) == "gyanopoliswork" || $(hostname) == "atomicweb-sp.home" || $(hostname) == "localhost.localdomain" ]]; then
  rdb_dir="/home/share/Developments/atomicweb/rootdb"
fi

if [[ $(hostname) == "asuslaptop" ]]; then
  rdb_dir="/home/sebastienp/Developments/atomicweb/rootdb"
fi

cd "${rdb_dir}/frontend-react" || exit

echo "#"
echo "# Compile prod build..."
echo "#"
docker exec -u node -it dev-rootdb-frontend-react npm run build

echo "#"
echo "# Seed DB with prod data..."
echo "#"
docker exec -u rootdb -it dev-rootdb-api php artisan db:wipe --force -n && mysql -u root -pglopglop -h 172.20.0.50 rootdb-api </home/share/Developments/atomicweb/rootdb/api/storage/app/seeders/production/seeder_init.sql

echo "#"
echo "# Install \"serve\" if not installed..."
echo "#"
docker exec -u root -it dev-rootdb-frontend-react yarn global add serve

echo "#"
echo "# Copy test app-config.js into build directory...."
echo "#"
cp -f "${rdb_dir}/frontend-react/doc/app-config.js" "${rdb_dir}/frontend-react/build"

echo "#"
echo "# Serve Prod build..."
echo "#"
docker exec -d -u node -it dev-rootdb-frontend-react serve -s build

echo "#"
echo "# # Start Cypress..."
echo "#"
yarn run cypress:open
