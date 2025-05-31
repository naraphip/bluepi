<?php

namespace App\Controllers;

class Booking extends BaseController
{
    protected $db;
    protected $bookingLib;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->bookingLib = new \App\Libraries\BookingLib();
    }

        public function booking_detail()
    {
        try {
            $request = $this->request->getJSON();
            if (!$request || empty($request->token)) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => 'INVALID_REQUEST',
                    'message' => 'Invalid JSON request or missing token',
                ]);
            }

            $dataDecode = decode_booking_token($request->token);
            if (empty($dataDecode)) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => 'INVALID_TOKEN',
                    'message' => 'Invalid booking token',
                ]);
            }
            $jsonDecode = json_decode($dataDecode, true);
            $booking_no = $jsonDecode['booking_no'] ?? null;
            if (empty($jsonDecode) || empty($booking_no)) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => 'INVALID_DATA',
                    'message' => 'Invalid booking data',
                ]);
            }

            $checkBooking = $this->bookingLib->getTransactionByBookingNo($booking_no);
            if (!$checkBooking['status']) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => $checkBooking['error_code'],
                    'message' => $checkBooking['message'],
                ]);
            }

            $transaction = $checkBooking['data']; // ข้อมูลการจองที่ได้จากฐานข้อมูล
            if ($transaction->payment_status == 1) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => 'ALREADY_PAID',
                    'message' => 'This booking has already been paid.',
                ]);
            } else if ($transaction->payment_status == 2) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => 'CANCELLED',
                    'message' => 'This booking has been cancelled.',
                ]);
            }

            $products = $this->bookingLib->getProductsByBookingNo($booking_no);
            if (!$products['status']) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => $products['error_code'],
                    'message' => $products['message'],
                ]);
            }

            $products = $products['data']; // ข้อมูลสินค้าที่ได้จากฐานข้อมูล
            return $this->response->setJSON([
                'status' => true,
                'booking_no' => $booking_no,
                'amount' => $transaction->amount,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500, 'Internal Server Error: ' . $e->getMessage());
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'status' => false,
                'error_code' => 'INTERNAL_SERVER_ERROR',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ]);
        }
    }


    public function make_booking()
    {
        try {
            $request = $this->request->getJSON();
            if (!$request) {
                return $this->response->setJSON([
                    'status' => false,
                    'message' => 'Invalid JSON data',
                ]);
            }

            $bookingLib = new \App\Libraries\BookingLib();
            if (empty($request->productIds)) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => 'INVALID_REQUEST',
                    'message' => 'Missing required fields: productIds',
                ]);
            }

            $response = $bookingLib->booking($request);
            return $this->response->setJSON($response);
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ]);
        }
    }
}
