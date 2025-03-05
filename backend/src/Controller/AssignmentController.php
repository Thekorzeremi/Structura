<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Affectation;
use App\Entity\User;

final class AssignmentController extends AbstractController
{
    #[Route('/api/affectations/{id}', name: 'api_affectations_by_user', methods: ['GET'])]
    public function getAffectationsByUser(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $affectations = $entityManager->getRepository(Affectation::class)->findBy(['user' => $user]);

        $result = array_map(fn($affectation) => [
            'title' => $affectation->getTitle(),
            'place' => $affectation->getPlace(),
        ], $affectations);

        return $this->json($result);
    }
}
