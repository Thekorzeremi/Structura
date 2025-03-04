cd ..

php bin/console doctrine:database:drop --force --no-interaction --if-exists

php bin/console doctrine:database:create --no-interaction --if-not-exists

php bin/console doctrine:schema:create

php bin/console doctrine:schema:update --force

php bin/console hautelook:fixtures:load --no-interaction