<?php

namespace App\EventListener;

use App\Entity\User;
use Firebase\JWT\JWT;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class AuthenticationSuccessListener
{
    private const REFRESH_TOKEN_DURATION = 2592000; // 30 days in seconds

    public function __construct(
        private ParameterBagInterface $params
    ) {}

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

        $now = new \DateTimeImmutable();
        $refreshTokenPayload = [
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
            'iat' => $now->getTimestamp(),
            'exp' => $now->modify('+30 days')->getTimestamp(),
        ];

        $refreshToken = JWT::encode($refreshTokenPayload, $this->params->get('kernel.secret'), 'HS256');

        $data['refresh_token'] = $refreshToken;
        $data['expires_in'] = 3600;
        $data['refresh_token_expires_in'] = self::REFRESH_TOKEN_DURATION;

        $event->setData($data);
    }
}
