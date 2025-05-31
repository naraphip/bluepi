<?php namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $allowedOrigin = 'http://localhost:3000';
        
        header("Access-Control-Allow-Origin: {$allowedOrigin}");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform, User-Agent");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400"); // 1 วัน

        // จัดการ preflight request (OPTIONS)
        if ($request->getMethod() === 'options') {
            header('HTTP/1.1 204 No Content');
            exit();
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // ไม่ต้องทำอะไรหลัง request
    }
}