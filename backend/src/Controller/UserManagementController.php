<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class UserManagementController extends AbstractController
{
    ###Gestion Personnel GET API
    #[Route('/api/management/{id}', name: 'get_user', methods: ['GET'])]

    public function getProfileUser(int $id, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'No authenticated user found'], 401);
        }
        
        if (!$this->isGranted('ROLE_ADMIN') && !$this->isGranted('ROLE_MANAGER') && !$this->isGranted('ROLE_USER')) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $user = $entityManager->getRepository(User::class)->find($id);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        return $this->json([
            'id' => $user->getId(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'email' => $user->getEmail(),
            'phone' => $user->getPhone(),
            'roles' => $user->getRoles(),
            #'profile_pic' => $user->getProfilePic(),
            'skills' => $user->getSkills(),
            'job' => $user->getJob(),
        ]);
    }
}
