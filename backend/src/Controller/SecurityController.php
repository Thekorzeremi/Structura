<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\RefreshTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\RefreshTokenGeneratorInterface;
use Psr\Log\LoggerInterface;

final class SecurityController extends AbstractController
{
    public function __construct(
        private LoggerInterface $logger
    ) {}

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $this->logger->info('[SecurityController] Register - Receiving API Request');

        try {
            $data = json_decode($request->getContent(), true);
            $this->logger->info('[SecurityController] Register - Data received: ' . print_r($data, true));
        } catch (\JsonException $e) {
            $this->logger->error('[SecurityController] Register - Invalid JSON', ['exception' => $e]);
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $requiredFields = ['first_name', 'last_name','email', 'password'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $this->logger->error('[SecurityController] Register - Missing required field: ' . $field);
                return $this->json(['error' => 'Missing required field: ' . $field], Response::HTTP_BAD_REQUEST);
            }
        }

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            $this->logger->warning('[SecurityController] Register - User with email already exists: ' . $data['email']);
            return $this->json(['error' => 'User with email already exists: ' . $data['email']], Response::HTTP_BAD_REQUEST);
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
}
