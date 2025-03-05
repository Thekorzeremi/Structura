<?php

namespace App\Tests\Controller;

use App\Entity\Worksite;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class WorksiteControllerTest extends WebTestCase
{
    private $client;
    private $entityManager;
    private $testUserEmail = 'test@example.com';
    private $token;
    private $testWorksite;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

        $userData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => $this->testUserEmail,
            'password' => 'Test123!'
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
        
        if (!isset($content['token'])) {
            throw new \RuntimeException('Failed to get JWT token. Response: ' . $response->getContent());
        }
        
        $this->token = $content['token'];
    }

    public function testGetWorksites(): void
    {
        $this->client->request(
            'GET',
            '/api/worksites/',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ]
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertIsArray($content);
    }

    public function testCreateWorksite(): void
    {
        $worksiteData = [
            'title' => 'Construction Site A',
            'start_date' => '2025-03-06T10:00:00+00:00',
            'end_date' => '2025-03-06T11:00:00+00:00',
            'place' => 'Paris',
            'description' => 'Major construction project',
            'skills' => ['Construction', 'Engineering']
        ];

        $this->client->request(
            'POST',
            '/api/worksites/',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ],
            json_encode($worksiteData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(201, $response->getStatusCode());
        self::assertEquals('Construction Site A', $content['title']);
        self::assertEquals('Paris', $content['place']);
        self::assertEquals(['Construction', 'Engineering'], $content['skills']);

        $this->testWorksite = $content['id'];
    }

    public function testGetWorksite(): void
    {
        $this->testCreateWorksite();

        $this->client->request(
            'GET',
            '/api/worksites/' . $this->testWorksite,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ]
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertEquals('Construction Site A', $content['title']);
        self::assertEquals('Paris', $content['place']);
    }

    public function testUpdateWorksite(): void
    {
        $this->testCreateWorksite();

        $updateData = [
            'title' => 'Updated Construction Site',
            'place' => 'Lyon',
            'skills' => ['Construction', 'Engineering', 'Management']
        ];

        $this->client->request(
            'PUT',
            '/api/worksites/' . $this->testWorksite,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ],
            json_encode($updateData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertEquals('Updated Construction Site', $content['title']);
        self::assertEquals('Lyon', $content['place']);
        self::assertEquals(['Construction', 'Engineering', 'Management'], $content['skills']);
    }

    public function testDeleteWorksite(): void
    {
        $this->testCreateWorksite();

        $this->client->request(
            'DELETE',
            '/api/worksites/' . $this->testWorksite,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ]
        );

        self::assertEquals(204, $this->client->getResponse()->getStatusCode());

        $deletedWorksite = $this->entityManager->getRepository(Worksite::class)->find($this->testWorksite);
        self::assertNull($deletedWorksite);
    }

    public function testGetNonExistentWorksite(): void
    {
        $this->client->request(
            'GET',
            '/api/worksites/99999',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ]
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(404, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertEquals('Worksite not found', $content['error']);
    }

    public function testUpdateNonExistentWorksite(): void
    {
        $updateData = [
            'title' => 'Updated Construction Site',
            'place' => 'Lyon'
        ];

        $this->client->request(
            'PUT',
            '/api/worksites/99999',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ],
            json_encode($updateData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(404, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertEquals('Worksite not found', $content['error']);
    }

    public function testDeleteNonExistentWorksite(): void
    {
        $this->client->request(
            'DELETE',
            '/api/worksites/99999',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $this->token
            ]
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(404, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertEquals('Worksite not found', $content['error']);
    }

    protected function tearDown(): void
    {
        if ($this->testWorksite) {
            $worksite = $this->entityManager->getRepository(Worksite::class)->find($this->testWorksite);
            if ($worksite) {
                $this->entityManager->remove($worksite);
                $this->entityManager->flush();
            }
        }

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);
        if ($user) {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
        }

        parent::tearDown();
    }
}
