<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserProfileController extends AbstractController
{
    ###Profil & Paramètres GET API
    #[Route('/api/profile/{id}', name: 'get_profile', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getProfile(int $id, EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'No authenticated user found'], 401);
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

    ###Profil & Paramètres GET API
    #[Route('/api/profile/{id}', name: 'update_profile', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updateProfile(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        if (isset($data['first_name'])) { $user->setFirstName($data['first_name']); }
        if (isset($data['last_name'])) { $user->setLastName($data['last_name']); }
        if (isset($data['phone'])) { $user->setPhone($data['phone']); }
        #if (isset($data['profile_pic'])) { $user->setProfilePic($data['profile_pic']); }
        if (isset($data['skills'])) { $user->setSkills($data['skills']); }
        if (isset($data['job'])) { $user->setJob($data['job']); }

        $entityManager->flush();

        return $this->json(['message' => 'Profile updated successfully']);
    }
}
