<?php

namespace App\Controller;

use App\Entity\Worksite;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/worksites')]
class WorksiteController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/', name: 'get_worksites', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $worksites = $this->entityManager->getRepository(Worksite::class)->findAll();
        $data = $this->serializer->serialize($worksites, 'json', ['groups' => ['worksite:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'get_worksite', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $worksite = $this->entityManager->getRepository(Worksite::class)->find($id);

        if (!$worksite) {
            return $this->json(['error' => 'Worksite not found'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($worksite, 'json', ['groups' => ['worksite:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/', name: 'create_worksite', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'], $data['start_date'], $data['end_date'], $data['place'])) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        $worksite = new Worksite();
        $worksite->setTitle($data['title']);
        $worksite->setStartDate(new \DateTime($data['start_date']));
        $worksite->setEndDate(new \DateTime($data['end_date']));
        $worksite->setPlace($data['place']);

        // Optional fields
        if (isset($data['description'])) {
            $worksite->setDescription($data['description']);
        }
        if (isset($data['skills'])) {
            $worksite->setSkills($data['skills']);
        }

        $this->entityManager->persist($worksite);
        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($worksite, 'json', ['groups' => ['worksite:read']]);
        return new JsonResponse($responseData, Response::HTTP_CREATED, [], true);
    }

    #[Route('/{id}', name: 'update_worksite', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $worksite = $this->entityManager->getRepository(Worksite::class)->find($id);

        if (!$worksite) {
            return $this->json(['error' => 'Worksite not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $worksite->setTitle($data['title']);
        }
        if (isset($data['start_date'])) {
            $worksite->setStartDate(new \DateTime($data['start_date']));
        }
        if (isset($data['end_date'])) {
            $worksite->setEndDate(new \DateTime($data['end_date']));
        }
        if (isset($data['place'])) {
            $worksite->setPlace($data['place']);
        }
        if (isset($data['description'])) {
            $worksite->setDescription($data['description']);
        }
        if (isset($data['skills'])) {
            $worksite->setSkills($data['skills']);
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($worksite, 'json', ['groups' => ['worksite:read']]);
        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete_worksite', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $worksite = $this->entityManager->getRepository(Worksite::class)->find($id);

        if (!$worksite) {
            return $this->json(['error' => 'Worksite not found'], Response::HTTP_NOT_FOUND);
        }

        // Check if worksite has associated events
        if (!$worksite->getEvent()->isEmpty()) {
            return $this->json(['error' => 'Cannot delete worksite with associated events'], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->remove($worksite);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
