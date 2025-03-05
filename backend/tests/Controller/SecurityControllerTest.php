<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class SecurityControllerTest extends WebTestCase
{
    private $client;
    private $entityManager;
    private $testUserEmail = 'test@example.com';

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);
        if ($existingUser) {
            $this->entityManager->remove($existingUser);
            $this->entityManager->flush();
        }
    }

    public function testSuccessfulRegistration(): void
    {
        $userData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $this->testUserEmail,
            'password' => 'Test123!',
        ];

        $this->client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertArrayHasKey('token', $content);
    }

    public function testRegistrationWithExistingEmail(): void
    {
        $userData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $this->testUserEmail,
            'password' => 'Test123!',
        ];

        $this->client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $this->client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(400, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertStringContainsString('already exists', $content['error']);
    }

    public function testRegistrationWithMissingFields(): void
    {
        $userData = [
            'first_name' => 'John',
            'email' => $this->testUserEmail,
        ];

        $this->client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($userData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(400, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertStringContainsString('Missing required field', $content['error']);
    }

    public function testSuccessfulLogin(): void
    {
        $password = 'Test123!';
        $user = new User();
        $user->setFirstName('John');
        $user->setLastName('Doe');
        $user->setEmail($this->testUserEmail);

        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $loginData = [
            'email' => $this->testUserEmail,
            'password' => $password,
        ];

        $this->client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($loginData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertArrayHasKey('token', $content);
    }

    public function testLoginWithInvalidCredentials(): void
    {
        $password = 'Test123!';
        $user = new User();
        $user->setFirstName('John');
        $user->setLastName('Doe');
        $user->setEmail($this->testUserEmail);

        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);
        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $loginData = [
            'email' => $this->testUserEmail,
            'password' => 'wrongpassword',
        ];

        $this->client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($loginData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(401, $response->getStatusCode());
        self::assertArrayHasKey('code', $content);
        self::assertArrayHasKey('message', $content);
        self::assertEquals(401, $content['code']);
        self::assertEquals('Invalid credentials.', $content['message']);
    }

    protected function tearDown(): void
    {
        $testUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);
        if ($testUser) {
            $this->entityManager->remove($testUser);
            $this->entityManager->flush();
        }

        parent::tearDown();
    }
}
