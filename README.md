# Projet_Hackathon
## Stacks
- Backend : Symfony
- Frontend : React
2025

## Launch project
###
Ensure that you have a LAMP server with PHP and MySQL installed. Please install Symfony CLI and Composer as well.
### Backend
#### Terminal 1
- cd backend
- composer install
- symfony server:start
#### Terminal 2
- cd backend
- php bin/console doctrine:database:drop --force
- php bin/console doctrine:database:create
- php bin/console doctrine:schema:update --force
- php bin/console hautelook:fixtures:load --no-interaction
### Frontend
- cd frontend
- npm install
- npm start
### Project
Go to http://localhost:3000 to launch project
### Credentials
Thanks to fixtures, you'll have data in your db.
- ROLE_USER :
  - email : remi@remi.remi
  - password : remi
- ROLE_MANAGER :
  - email : manager@manager.manager
  - password : remi 
- ROLE_ADMIN :
  - email : admin@admin.admin
  - password : remi 
## Prettier
### Backend
./vendor/bin/php-cs-fixer fix
./vendor/bin/php-cs-fixer fix src/Controller/SecurityController.php
### Frontend
npx prettier --write .
npx prettier --write assets/controllers.json

## API
Please add this in **access_control** section in **config/packages/security.yaml** :
- { path: ^/api/doc, roles: PUBLIC_ACCESS }  
See http://localhost:8000/api/doc/ for the API documentation.
