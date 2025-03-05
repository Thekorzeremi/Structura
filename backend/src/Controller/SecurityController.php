<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use OpenApi\Attributes as OA;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class SecurityController extends AbstractController
{
    public function __construct(
        private LoggerInterface $logger,
    ) {
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    #[OA\Post(
        path: '/api/register',
        summary: 'Register a new user',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['first_name', 'last_name', 'email', 'password'],
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
                description: 'User successfully registered',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'token', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 400, description: 'Invalid input'),
        ]
    )]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $this->logger->info('[SecurityController] Register - Receiving API Request');

        try {
            $data = json_decode($request->getContent(), true);
            $this->logger->info('[SecurityController] Register - Data received: '.print_r($data, true));
        } catch (\JsonException $e) {
            $this->logger->error('[SecurityController] Register - Invalid JSON', ['exception' => $e]);

            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $requiredFields = ['first_name', 'last_name', 'email', 'password'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $this->logger->error('[SecurityController] Register - Missing required field: '.$field);

                return $this->json(['error' => 'Missing required field: '.$field], Response::HTTP_BAD_REQUEST);
            }
        }

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            $this->logger->warning('[SecurityController] Register - User with email already exists: '.$data['email']);

            return $this->json(['error' => 'User with email already exists: '.$data['email']], Response::HTTP_BAD_REQUEST);
        }

        try {
            $user = new User();
            $user->setFirstName($data['first_name']);
            $user->setLastName($data['last_name']);
            $user->setEmail($data['email']);
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
            $entityManager->persist($user);
            $entityManager->flush();
            $this->logger->info('[SecurityController] Register - User registered !');
        } catch (\Exception $e) {
            $this->logger->error('[SecurityController] Register - Failed to register user', ['exception' => $e]);

            return $this->json(['error' => 'Failed to register user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $token = $jwtManager->create($user);
            $this->logger->info('[SecurityController] Register - Token created !');

            return $this->json(['token' => $token], Response::HTTP_OK);
        } catch (\Exception $e) {
            $this->logger->error('[SecurityController] Register - Failed to create token', ['exception' => $e]);

            return $this->json(['error' => 'Failed to create token'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/login_check', name: 'app_login')]
    #[OA\Post(
        path: '/api/login_check',
        summary: 'Login to get a JWT token',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string'),
                    new OA\Property(property: 'password', type: 'string', format: 'password'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Login successful',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'token', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Invalid credentials'),
        ]
    )]
    public function loginCheck(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager, LoggerInterface $logger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $this->logger->info('[SecurityController] Login - Data received: '.print_r($data, true));
        } catch (\JsonException $e) {
            $this->logger->error('[SecurityController] Login - Invalid JSON', ['exception' => $e]);

            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['email'], $data['password'])) {
            $this->logger->error('[SecurityController] Login - Missing required fields : '.print_r($data, true));

            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if (!$user || !$passwordHasher->isPasswordValid($user, $data['password'])) {
                $this->logger->error('[SecurityController] Login - Invalid credentials');

                return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
            }
            $this->logger->info('[SecurityController] Login - User logged in !');
        } catch (\Exception $e) {
            $this->logger->error('[SecurityController] Login - Failed to login user', ['exception' => $e]);

            return $this->json(['error' => 'Failed to login user'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $token = $jwtManager->create($user);
            $this->logger->info('[SecurityController] Login - Token created !');

            return $this->json(['token' => $token], Response::HTTP_OK);
        } catch (\Exception $e) {
            $this->logger->error('[SecurityController] Login - Failed to create token', ['exception' => $e]);

            return $this->json(['error' => 'Failed to create token'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
