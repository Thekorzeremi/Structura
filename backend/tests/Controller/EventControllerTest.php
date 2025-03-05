<?php

namespace App\Tests\Controller;

use App\Entity\Event;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class EventControllerTest extends WebTestCase
{
    private $client;
    private $entityManager;
    private $testUserEmail = 'test@example.com';
    private $token;
    private $testEvent;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

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

        if (!isset($content['token'])) {
            throw new \RuntimeException('Failed to get JWT token. Response: '.$response->getContent());
        }

        $this->token = $content['token'];
    }

    public function testGetEvents(): void
    {
        $this->client->request(
            'GET',
            '/api/events/',
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
        self::assertIsArray($content);
    }

    public function testCreateEvent(): void
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $this->testUserEmail]);

        $eventData = [
            'type' => 'Meeting',
            'status' => 'Scheduled',
            'start_date' => '2025-03-06T10:00:00+00:00',
            'end_date' => '2025-03-06T11:00:00+00:00',
            'user_id' => $user->getId(),
        ];

        $this->client->request(
            'POST',
            '/api/events/',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ],
            json_encode($eventData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(201, $response->getStatusCode());
        self::assertEquals('Meeting', $content['type']);
        self::assertEquals('Scheduled', $content['status']);

        $this->testEvent = $content['id'];
    }

    public function testGetEvent(): void
    {
        $this->testCreateEvent();

        $this->client->request(
            'GET',
            '/api/events/'.$this->testEvent,
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
        self::assertEquals('Meeting', $content['type']);
        self::assertEquals('Scheduled', $content['status']);
    }

    public function testUpdateEvent(): void
    {
        $this->testCreateEvent();

        $updateData = [
            'type' => 'Conference',
            'status' => 'In Progress',
        ];

        $this->client->request(
            'PUT',
            '/api/events/'.$this->testEvent,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ],
            json_encode($updateData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(200, $response->getStatusCode());
        self::assertEquals('Conference', $content['type']);
        self::assertEquals('In Progress', $content['status']);
    }

    public function testDeleteEvent(): void
    {
        $this->testCreateEvent();

        $this->client->request(
            'DELETE',
            '/api/events/'.$this->testEvent,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ]
        );

        self::assertEquals(204, $this->client->getResponse()->getStatusCode());

        $deletedEvent = $this->entityManager->getRepository(Event::class)->find($this->testEvent);
        self::assertNull($deletedEvent);
    }

    public function testDeleteNonExistentEvent(): void
    {
        $this->client->request(
            'DELETE',
            '/api/events/99999',
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
        self::assertEquals('Event not found', $content['error']);
    }

    public function testGetNonExistentEvent(): void
    {
        $this->client->request(
            'GET',
            '/api/events/99999',
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
        self::assertEquals('Event not found', $content['error']);
    }

    public function testUpdateNonExistentEvent(): void
    {
        $updateData = [
            'type' => 'Conference',
            'status' => 'In Progress',
        ];

        $this->client->request(
            'PUT',
            '/api/events/99999',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer '.$this->token,
            ],
            json_encode($updateData)
        );

        $response = $this->client->getResponse();
        $content = json_decode($response->getContent(), true);

        self::assertEquals(404, $response->getStatusCode());
        self::assertArrayHasKey('error', $content);
        self::assertEquals('Event not found', $content['error']);
    }

    protected function tearDown(): void
    {
        if ($this->testEvent) {
            $event = $this->entityManager->getRepository(Event::class)->find($this->testEvent);
            if ($event) {
                $this->entityManager->remove($event);
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
