<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250306024056 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE worksite ADD manager_id INT NOT NULL');
        $this->addSql('ALTER TABLE worksite ADD CONSTRAINT FK_5E464782783E3463 FOREIGN KEY (manager_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_5E464782783E3463 ON worksite (manager_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE worksite DROP FOREIGN KEY FK_5E464782783E3463');
        $this->addSql('DROP INDEX IDX_5E464782783E3463 ON worksite');
        $this->addSql('ALTER TABLE worksite DROP manager_id');
    }
}
