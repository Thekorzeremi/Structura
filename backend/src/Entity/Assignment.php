<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Worksite;
use App\Entity\User;

final class AssignmentController extends AbstractController
{
    #[Route('/api/worksites/{id}', name: 'api_worksites_by_user', methods: ['GET'])]
    public function getWorksitesByUser(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }
        
        $worksites = $entityManager->getRepository(Worksite::class)->findAll();

        $result = array_map(fn($worksite) => [
            'title' => $worksite->getTitle(),
            'place' => $worksite->getPlace(),
        ], $worksites);

        return $this->json($result);
    }
}
