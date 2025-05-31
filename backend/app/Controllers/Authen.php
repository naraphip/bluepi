<?php

namespace App\Controllers;
use Firebase\JWT\JWT;

class Authen extends BaseController
{
    protected $secretKey;

    public function __construct()
    {
        $this->secretKey = JWT_SECRET;
    }

    public function token()
    {
        $request_key = $this->request->getVar('request_key');
        if (empty($request_key) || $request_key !== REQUEST_KEY) {
            return $this->response->setStatusCode(401, 'Unauthorized');
        }
        $payload = [
            'iss' => 'your-issuer', // Issuer of the token
            'iat' => time(), // Issued at: time when the token was generated
            'exp' => time() + 3600, // Expiration time: 1 hour from now
            'data' => [
                'userId' => 1, // Example user ID
                'username' => 'testuser', // Example username
            ],
        ];
        $jwt = JWT::encode($payload, $this->secretKey, 'HS256');
        return $this->response->setJSON(['token' => $jwt]);
    }

    public function validateToken()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->response->setStatusCode(401, 'Authorization token not found');
        }

        $token = explode(' ', $authHeader)[1];

        try {
            $decoded = JWT::decode($token, new \Firebase\JWT\Key($this->secretKey, 'HS256'));
            return $this->response->setJSON(['message' => 'Token is valid', 'data' => (array)$decoded]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(401, 'Invalid token: ' . $e->getMessage());
        }
    }
}
