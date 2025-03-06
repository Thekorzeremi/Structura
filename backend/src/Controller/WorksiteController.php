<?php

namespace App\Controller;

use App\Entity\Worksite;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/worksites')]
#[OA\Tag(name: 'Worksites')]
class WorksiteController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/', name: 'get_worksites', methods: ['GET'])]
    #[OA\Get(
        path: '/api/worksites/',
        summary: 'Get all worksites',
        responses: [
            new OA\Response(
                response: 200,
                description: 'Returns all worksites',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: new Model(type: Worksite::class, groups: ['worksite:read']))
                )
            ),
        ]
    )]
    public function index(): JsonResponse
    {
        $worksites = $this->entityManager->getRepository(Worksite::class)->findAll();
        
        $formattedWorksites = array_map(function ($worksite) {
            return [
                'id' => $worksite->getId(),
                'title' => $worksite->getTitle(),
                'start_date' => $worksite->getStartDate()->format('Y-m-d'),
                'end_date' => $worksite->getEndDate()->format('Y-m-d'),
                'place' => $worksite->getPlace(),
                'description' => $worksite->getDescription(),
                'skills' => $worksite->getSkills(),
            ];
        }, $worksites);

        $data = $this->serializer->serialize($formattedWorksites, 'json', ['groups' => ['worksite:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id<\d+>}', name: 'get_worksite', methods: ['GET'])]
    #[OA\Get(
        path: '/api/worksites/{id}',
        summary: 'Get a worksite by ID',
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Returns the worksite',
                content: new OA\JsonContent(ref: new Model(type: Worksite::class, groups: ['worksite:read']))
            ),
            new OA\Response(response: 404, description: 'Worksite not found'),
        ]
    )]
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
    #[OA\Post(
        path: '/api/worksites/',
        summary: 'Create a new worksite',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['title', 'start_date', 'end_date', 'place'],
                properties: [
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'start_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'end_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'place', type: 'string'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'skills', type: 'array', items: new OA\Items(type: 'string')),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Worksite created',
                content: new OA\JsonContent(ref: new Model(type: Worksite::class, groups: ['worksite:read']))
            ),
            new OA\Response(response: 400, description: 'Invalid input'),
        ]
    )]
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
    #[OA\Put(
        path: '/api/worksites/{id}',
        summary: 'Update a worksite',
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'start_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'end_date', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'place', type: 'string'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'skills', type: 'array', items: new OA\Items(type: 'string')),
                    new OA\Property(property: 'manager_id', type: 'integer'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Worksite updated',
                content: new OA\JsonContent(ref: new Model(type: Worksite::class, groups: ['worksite:read']))
            ),
            new OA\Response(response: 404, description: 'Worksite not found'),
        ]
    )]
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
        if (isset($data['manager_id'])) {
            $manager = $this->entityManager->getRepository(User::class)->find($data['manager_id']);
            if ($manager) {
                $worksite->setManager($manager);
            } else {
                return $this->json(['error' => 'Manager not found'], Response::HTTP_NOT_FOUND);
            }
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($worksite, 'json', ['groups' => ['worksite:read']]);

        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete_worksite', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/worksites/{id}',
        summary: 'Delete a worksite',
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Worksite deleted'),
            new OA\Response(response: 404, description: 'Worksite not found'),
            new OA\Response(response: 400, description: 'Cannot delete worksite with associated events'),
        ]
    )]
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

    #[Route('/managers', name: 'get_managers', methods: ['GET'])]
    #[OA\Get(
        path: '/managers',
        summary: 'Get all managers',
        responses: [
            new OA\Response(
                response: 200,
                description: 'Returns all users with ROLE_MANAGER',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer'),
                            new OA\Property(property: 'name', type: 'string'),
                            new OA\Property(property: 'roles', type: 'array', items: new OA\Items(type: 'string')),
                        ]
                    )
                )
            ),
        ]
    )]
    public function getManagers(): JsonResponse
    {
        $userRepository = $this->entityManager->getRepository(User::class);
        $managers = $userRepository->createQueryBuilder('u')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%ROLE_MANAGER%')
            ->getQuery()
            ->getResult();

        $formattedManagers = array_map(function ($manager) {
            return [
                'id' => $manager->getId(),
                'first_name' => $manager->getFirstName(),
                'last_name' => $manager->getLastName(),
                'roles' => $manager->getRoles(),
            ];
        }, $managers);

        return new JsonResponse($formattedManagers, Response::HTTP_OK);
    }
}
