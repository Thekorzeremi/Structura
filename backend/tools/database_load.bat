cd ..

symfony console doctrine:database:drop --force --no-interaction --if-exists

symfony console doctrine:database:create --no-interaction --if-not-exists

symfony console doctrine:schema:create

symfony console doctrine:schema:update --force

symfony console hautelook:fixtures:load --no-interaction