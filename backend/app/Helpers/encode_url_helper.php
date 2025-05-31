<?php

use Firebase\JWT\JWT;

if (!function_exists('encode_booking_token')) {
    /**
     * Encode a string to base64 format.
     *
     * @param string $string The string to encode.
     * @return string The base64 encoded string.
     */
    function encode_booking_token(string $string): string
    {
        try {
            $payload = [
                'data' => $string,
                'exp' => time() + 3600, // Token valid for 1 hour
            ];
            $jwt = JWT::encode($payload, SECRET_KEY, 'HS256');
            return base64_encode($jwt);
        } catch (\Exception $e) {
            return ''; // Return an empty string if encoding fails
        }
    }
}

if (!function_exists('decode_booking_token')) {
    /**
     * Decode a base64 encoded string to its original format.
     *
     * @param string $encodedString The base64 encoded string.
     * @return string|null The decoded string or null if decoding fails.
     */
    function decode_booking_token(string $encodedString): ? string
    {
        try {
            $decodedString = base64_decode($encodedString);
            if ($decodedString === false) {
                return null; // Decoding failed
            }
            $payload = JWT::decode($decodedString, new \Firebase\JWT\Key(SECRET_KEY, 'HS256'));
            return $payload->data ?? null; // Return the original string or null if not found
        } catch (\Exception $e) {
            return null; // Decoding failed or token is invalid
        }
    }
}
