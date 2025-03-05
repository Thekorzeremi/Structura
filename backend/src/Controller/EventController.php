<?php

namespace App\Controller;

use App\Entity\Event;
use App\Entity\User;
use App\Entity\Worksite;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/events')]
#[OA\Tag(name: 'Events')]
class EventController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/', name: 'get_events', methods: ['GET'])]
    #[OA\Get(
        path: '/api/events/',
        summary: 'Get all events',
        responses: [
            new OA\Response(
                response: 200,
                description: 'Returns all events',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: new Model(type: Event::class, groups: ['event:read']))
                )
            )
        ]
    )]
    public function index(): JsonResponse
    {
        $events = $this->entityManager->getRepository(Event::class)->findAll();
        $data = $this->serializer->serialize($events, 'json', ['groups' => ['event:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'get_event', methods: ['GET'])]
    #[OA\Get(
        path: '/api/events/{id}',
        summary: 'Get an event by ID',
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Returns the event',
                content: new OA\JsonContent(ref: new Model(type: Event::class, groups: ['event:read']))
            ),
            new OA\Response(response: 404, description: 'Event not found')
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $event = $this->entityManager->getRepository(Event::class)->find($id);

        if (!$event) {
            return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($event, 'json', ['groups' => ['event:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/', name: 'create_event', methods: ['POST'])]
    #[OA\Post(
        path: '/api/events/',
        summary: 'Create a new event',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['type', 'status', 'start_date', 'end_date', 'user_id'],
                properties: [
                    new OA\Property(property: 'type', type: 'string'),
                    new OA\Property(property: 'status', type: 'string'),
                    new OA\Property(property: 'start_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'end_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'user_id', type: 'integer'),
                    new OA\Property(property: 'worksite_id', type: 'integer')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Event created',
                content: new OA\JsonContent(ref: new Model(type: Event::class, groups: ['event:read']))
            ),
            new OA\Response(response: 400, description: 'Invalid input')
        ]
    )]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['type'], $data['status'], $data['start_date'], $data['end_date'], $data['user_id'])) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        $event = new Event();
        $event->setType($data['type']);
        $event->setStatus($data['status']);
        $event->setStartDate(new \DateTime($data['start_date']));
        $event->setEndDate(new \DateTime($data['end_date']));

        // Set User
        $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_BAD_REQUEST);
        }
        $event->setUser($user);

        // Set Worksite if provided
        if (isset($data['worksite_id'])) {
            $worksite = $this->entityManager->getRepository(Worksite::class)->find($data['worksite_id']);
            if (!$worksite) {
                return $this->json(['error' => 'Worksite not found'], Response::HTTP_BAD_REQUEST);
            }
            $event->setWorksite($worksite);
        }

        $this->entityManager->persist($event);
        $this->entityManager->flush();

        $data = $this->serializer->serialize($event, 'json', ['groups' => ['event:read']]);

        return new JsonResponse($data, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'update_event', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/events/{id}',
        summary: 'Update an event',
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'type', type: 'string'),
                    new OA\Property(property: 'status', type: 'string'),
                    new OA\Property(property: 'start_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'end_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'user_id', type: 'integer'),
                    new OA\Property(property: 'worksite_id', type: 'integer')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Event updated',
                content: new OA\JsonContent(ref: new Model(type: Event::class, groups: ['event:read']))
            ),
            new OA\Response(response: 404, description: 'Event not found')
        ]
    )]
    public function update(Request $request, int $id): JsonResponse
    {
        $event = $this->entityManager->getRepository(Event::class)->find($id);

        if (!$event) {
            return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['type'])) {
            $event->setType($data['type']);
        }
        if (isset($data['status'])) {
            $event->setStatus($data['status']);
        }
        if (isset($data['start_date'])) {
            $event->setStartDate(new \DateTime($data['start_date']));
        }
        if (isset($data['end_date'])) {
            $event->setEndDate(new \DateTime($data['end_date']));
        }
        if (isset($data['user_id'])) {
            $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);
            if (!$user) {
                return $this->json(['error' => 'User not found'], Response::HTTP_BAD_REQUEST);
            }
            $event->setUser($user);
        }
        if (isset($data['worksite_id'])) {
            $worksite = $this->entityManager->getRepository(Worksite::class)->find($data['worksite_id']);
            if (!$worksite) {
                return $this->json(['error' => 'Worksite not found'], Response::HTTP_BAD_REQUEST);
            }
            $event->setWorksite($worksite);
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($event, 'json', ['groups' => ['event:read']]);

        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete_event', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/events/{id}',
        summary: 'Delete an event',
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(response: 204, description: 'Event deleted'),
            new OA\Response(response: 404, description: 'Event not found')
        ]
    )]
    public function delete(int $id): JsonResponse
    {
        $event = $this->entityManager->getRepository(Event::class)->find($id);

        if (!$event) {
            return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($event);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
