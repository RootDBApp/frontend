# Image updates to do

* docker-entrypoint.sh
  *  
  * yarn install


# Cypress have to be installed locally.

```bash
yarn add cypress --dev
```

# All steps to automatize

```bash
# Compile prod build
docker exec -u node -it dev-rootdb-frontend-react npm run build

# Seed DB with prod data
docker exec -u rootdb -it dev-rootdb-api php artisan db:wipe --force -n && mysql -u root -pglopglop -h 172.20.0.50 rootdb-api  < /home/share/Developments/atomicweb/rootdb/api/storage/app/seeders/production/seeder_init.sql

# If `serve` not installed :
docker exec -u root -it dev-rootdb-frontend-react yarn global add serve

# Copy test app-config.js into build directory.
cp -f doc/app-config.js build/

# Serve Prod build
docker exec -u node -it dev-rootdb-frontend-react serve -s build

# Start Cypress
yarn run cypress:open

```