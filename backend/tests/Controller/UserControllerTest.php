<?php

namespace App\Tests\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserControllerTest extends WebTestCase
{
    private $client;
    private $entityManager;
    private $testUserEmail = 'test@example.com';
    private $token;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);
        if ($existingUser) {
            $this->entityManager->remove($existingUser);
            $this->entityManager->flush();
        }

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
        echo "\nRegistration response in setUp: ".$response->getContent()."\n";
        echo 'Status code: '.$response->getStatusCode()."\n";

        $content = json_decode($response->getContent(), true);

        if (!isset($content['token'])) {
            throw new \RuntimeException('Failed to get JWT token. Response: '.$response->getContent());
        }

        $this->token = $content['token'];
    }

    public function testGetUsers(): void
    {
        $this->client->request(
            'GET',
            '/api/users/',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ]
        );

        $response = $this->client->getResponse();
        echo "\nGet users response: ".$response->getContent()."\n";
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertIsArray($content);
        self::assertNotEmpty($content);
    }

    public function testGetUser(): void
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);

        $this->client->request(
            'GET',
            '/api/users/'.$user->getId(),
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ]
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertEquals($this->testUserEmail, $content['email']);
        self::assertEquals('John', $content['first_name']);
        self::assertEquals('Doe', $content['last_name']);
    }

    public function testGetNonExistentUser(): void
    {
        $this->client->request(
            'GET',
            '/api/users/99999',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ]
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(404, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertEquals('User not found', $content['error']);
    }

    public function testUpdateUser(): void
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);
        $newData = [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
        ];

        $this->client->request(
            'PUT',
            '/api/users/'.$user->getId(),
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ],
            json_encode($newData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertEquals('Jane', $content['first_name']);
        self::assertEquals('Smith', $content['last_name']);
    }

    public function testUpdateNonExistentUser(): void
    {
        $newData = [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
        ];

        $this->client->request(
            'PUT',
            '/api/users/99999',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ],
            json_encode($newData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(404, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertEquals('User not found', $content['error']);
    }

    public function testDeleteUser(): void
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);

        $this->client->request(
            'DELETE',
            '/api/users/'.$user->getId(),
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ]
        );

        self::assertEquals(204, $this->client->getResponse()->getStatusCode());

        $deletedUser = $this->entityManager->getRepository(User::class)->find($user->getId());
        self::assertNull($deletedUser);
    }

    public function testDeleteNonExistentUser(): void
    {
        $this->client->request(
            'DELETE',
            '/api/users/99999',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ]
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(404, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertEquals('User not found', $content['error']);
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
