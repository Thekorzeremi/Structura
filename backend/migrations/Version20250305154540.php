<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250305154540 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE assignment ADD worksite_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE assignment ADD CONSTRAINT FK_30C544BAA47737E7 FOREIGN KEY (worksite_id) REFERENCES worksite (id)');
        $this->addSql('CREATE INDEX IDX_30C544BAA47737E7 ON assignment (worksite_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE assignment DROP FOREIGN KEY FK_30C544BAA47737E7');
        $this->addSql('DROP INDEX IDX_30C544BAA47737E7 ON assignment');
        $this->addSql('ALTER TABLE assignment DROP worksite_id');
    }
}
