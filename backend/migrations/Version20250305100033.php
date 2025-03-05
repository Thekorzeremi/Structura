<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250305100033 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user ADD job VARCHAR(255) NOT NULL, ADD phone VARCHAR(255) DEFAULT NULL, CHANGE first_name first_name VARCHAR(255) NOT NULL, CHANGE last_name last_name VARCHAR(255) NOT NULL, CHANGE email email VARCHAR(255) NOT NULL, CHANGE password password VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE worksite ADD place VARCHAR(255) NOT NULL, ADD notes VARCHAR(255) DEFAULT NULL, CHANGE title title VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user DROP job, DROP phone, CHANGE first_name first_name VARCHAR(30) NOT NULL, CHANGE last_name last_name VARCHAR(30) NOT NULL, CHANGE email email VARCHAR(50) NOT NULL, CHANGE password password VARCHAR(30) NOT NULL');
        $this->addSql('ALTER TABLE worksite DROP place, DROP notes, CHANGE title title VARCHAR(50) NOT NULL');
    }
}
