<?php

if (!function_exists('generate_booking_no')) {
    /**
     * Generate a unique booking number.
     *
     * @return string The generated booking number.
     */
    function generate_booking_no(): string
    {
        $prefix = 'BP';
        return $prefix . date('ymd') .  random_string_booking(2) . date('His') . random_string_booking(1) . random_number_booking(1);
    }
}

if (!function_exists('random_string_booking')) {
    /**
     * Generate a random string of uppercase letters.
     *
     * @param int $length The length of the random string to generate.
     * @return string The generated random string.
     */
    function random_string_booking($length = 10): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }
}

if (!function_exists('get_booking_status')) {
    /**
     * Get the booking status based on the status code.
     *
     * @param int $statusCode The status code of the booking.
     * @return string The booking status.
     */
    function get_booking_status(int $statusCode): string
    {
        $status = [
            0 => 'Pending',
            1 => 'Confirmed',
            2 => 'Cancelled',
        ];

        return $status[$statusCode] ?? 'Unknown Status';
    }
}

if (!function_exists('random_number_booking')) {
    /**
     * Generate a random number of a specified length.
     *
     * @param int $length The length of the random number to generate.
     * @return string The generated random number.
     */
    function random_number_booking($length = 10): string
    {
        $characters = '0123456789';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }
}
