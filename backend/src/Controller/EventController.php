<?php

namespace App\Controller;

use App\Entity\Event;
use App\Entity\User;
use App\Entity\Worksite;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/events')]
class EventController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/', name: 'get_events', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $events = $this->entityManager->getRepository(Event::class)->findAll();
        $data = $this->serializer->serialize($events, 'json', ['groups' => ['event:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'get_event', methods: ['GET'])]
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
