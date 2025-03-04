<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 30)]
    private ?string $firstName = null;

    #[ORM\Column(length: 30)]
    private ?string $lastName = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(length: 50, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 30)]
    private ?string $password = null;

    #[ORM\OneToMany(mappedBy: "user", targetEntity: Assignment::class, cascade: ["persist", "remove"])]
    private Collection $assignments;

    /**
     * @var Collection<int, Assignment>
     */
    #[ORM\OneToMany(targetEntity: Assignment::class, mappedBy: 'user')]
    private Collection $assignemnts;

    #[ORM\Column]
    private array $skills = [];

    public function __construct()
    {
        $this->assignemnts = new ArrayCollection();
    }

    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getAssignments(): Collection
    {
        return $this->assignments;
    }

    /**
     * @return Collection<int, Assignment>
     */
    public function getAssignemnts(): Collection
    {
        return $this->assignemnts;
    }

    public function addAssignemnt(Assignment $assignemnt): static
    {
        if (!$this->assignemnts->contains($assignemnt)) {
            $this->assignemnts->add($assignemnt);
            $assignemnt->setUser($this);
        }

        return $this;
    }

    public function removeAssignemnt(Assignment $assignemnt): static
    {
        if ($this->assignemnts->removeElement($assignemnt)) {
            // set the owning side to null (unless already changed)
            if ($assignemnt->getUser() === $this) {
                $assignemnt->setUser(null);
            }
        }

        return $this;
    }

    public function getSkills(): ?array
    {
        return $this->skills;
    }

    public function setSkills(?array $skills): static
    {
        $this->skills = $skills;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->email; // Symfony uses this method for authentication
    }

    public function eraseCredentials(): void
    {
        // If you store temporary sensitive data, clear it here
    }

}
