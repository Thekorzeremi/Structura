<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use App\Repository\UserRepository;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/users')]
#[OA\Tag(name: 'Users')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository,
    ) {
    }

    #[Route('/', name: 'get_users', methods: ['GET'])]
    #[OA\Get(
        path: '/api/users/',
        summary: 'Get all users',
        responses: [
            new OA\Response(
                response: 200,
                description: 'Returns all users',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: new Model(type: User::class, groups: ['user:read']))
                )
            ),
        ]
    )]
    public function index(): JsonResponse
    {
        $users = $this->entityManager->getRepository(User::class)->findAll();
        $data = $this->serializer->serialize($users, 'json', ['groups' => ['user:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    

    #[Route('/{id}', name: 'get_user', methods: ['GET'])]
    #[OA\Get(
        path: '/api/users/{id}',
        summary: 'Get a user by ID',
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
                description: 'Returns the user',
                content: new OA\JsonContent(ref: new Model(type: User::class, groups: ['user:read']))
            ),
            new OA\Response(response: 404, description: 'User not found'),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = $this->serializer->serialize($user, 'json', ['groups' => ['user:read']]);

        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'update_user', methods: ['PUT'])]
    #[OA\Put(
        path: '/api/users/{id}',
        summary: 'Update a user',
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
                    new OA\Property(property: 'first_name', type: 'string'),
                    new OA\Property(property: 'last_name', type: 'string'),
                    new OA\Property(property: 'email', type: 'string', format: 'email'),
                    new OA\Property(property: 'password', type: 'string', format: 'password'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User updated',
                content: new OA\JsonContent(ref: new Model(type: User::class, groups: ['user:read']))
            ),
            new OA\Response(response: 404, description: 'User not found'),
        ]
    )]
    public function update(Request $request, int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['first_name'])) {
            $user->setFirstName($data['first_name']);
        }
        if (isset($data['last_name'])) {
            $user->setLastName($data['last_name']);
        }
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        }

        $this->entityManager->flush();

        $responseData = $this->serializer->serialize($user, 'json', ['groups' => ['user:read']]);

        return new JsonResponse($responseData, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'delete_user', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/users/{id}',
        summary: 'Delete a user',
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(response: 204, description: 'User deleted'),
            new OA\Response(response: 404, description: 'User not found'),
        ]
    )]
    public function delete(int $id): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/me', name: 'get_current_user', methods: ['GET'], priority: 2)]
    #[OA\Get(
        path: '/api/users/me',
        summary: 'Get current user information',
        tags: ['Users'],
        parameters: [
            new OA\Parameter(
                name: 'email',
                in: 'query',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'email')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Returns the user information',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'id', type: 'integer'),
                        new OA\Property(property: 'email', type: 'string'),
                        new OA\Property(property: 'firstName', type: 'string'),
                        new OA\Property(property: 'lastName', type: 'string'),
                        new OA\Property(property: 'phone', type: 'string'),
                        new OA\Property(property: 'roles', type: 'array', items: new OA\Items(type: 'string')),
                        new OA\Property(property: 'skills', type: 'array', items: new OA\Items(type: 'string'))
                    ]
                )
            ),
            new OA\Response(response: 400, description: 'Email is required'),
            new OA\Response(response: 404, description: 'User not found')
        ]
    )]
    public function getCurrentUser(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;       

        if (!$email) {
            return new JsonResponse(
                ['error' => 'Email is required'], 
                Response::HTTP_BAD_REQUEST
            );
        }
        
        $user = $this->userRepository->findOneBy(['email' => $email]);

        
        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'], 
                Response::HTTP_NOT_FOUND
            );
        }
        
        $responseData = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'roles' => $user->getRoles(),
            'skills' => $user->getSkills()
        ];
        
        return new JsonResponse($responseData);
    }
}
