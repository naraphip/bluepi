<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthenFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return Services::response()->setStatusCode(401)->setJSON(['message' => 'Authorization token not found']);
        }

        $token = explode(' ', $authHeader)[1];

        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            $request->user = $decoded; // attach user to request
        } catch (\Exception $e) {
            return Services::response()->setStatusCode(401)->setJSON(['message' => 'Invalid token']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing
    }
}
