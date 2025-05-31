<?php

namespace App\Controllers;

class Payment extends BaseController
{
    protected $db;
    protected $bookingLib;
    protected $cashLib;
    protected $cashModel;
    protected $payment_status = [
        0 => 'Pending', // PENDING
        1 => 'Confirmed', // CONFIRMED
        2 => 'Cancelled', // CANCELLED
    ];

    public function __construct()
    {
        helper(['denominations', 'calculations']);
        $this->db = \Config\Database::connect();
        $this->bookingLib = new \App\Libraries\BookingLib();
        $this->cashModel = new \App\Models\CashModel();
        $this->cashLib = new \App\Libraries\CashLib();
    }

    public function checkout()
    {
        try {
            $request = $this->request->getJSON();

            if (!$request || empty($request->token) || empty($request->denomination) || empty($request->method)) {
                return $this->response->setJSON([
                    'status' => false,
                    'error_code' => 'INVALID_REQUEST',
                    'message' => 'Invalid JSON request or missing fields',
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

            switch ($request->method) {
                case 'cash':
                    $jsonDecode = json_decode($dataDecode, true);
                    $booking_no = $jsonDecode['booking_no'] ?? null;
                    $denomination = $request->denomination;
                    if (empty($jsonDecode) || empty($booking_no) || !is_array($denomination)) {
                        return $this->response->setJSON([
                            'status' => false,
                            'error_code' => 'INVALID_DATA',
                            'message' => 'Invalid booking data or denominations',
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

                    $totalPrice = $transaction->amount; // ราคาสินค้าทั้งหมดจากการจอง
                    $totalPaid = array_sum($denomination); // รวมมูลค่าของธนบัตร/เหรียญที่จ่ายมา
                    if ($totalPaid < $totalPrice) {
                        return $this->response->setJSON([
                            'status' => false,
                            'error_code' => 'INSUFFICIENT_AMOUNT',
                            'message' => 'Insufficient amount provided',
                        ]);
                    }

                    $cashInMachine = $this->cashModel->getCashDescending();
                    $cashInMachine = array_reduce($cashInMachine, function ($carry, $item) {
                        $carry[(int)$item->denomination] = (int)$item->quantity;
                        return $carry;
                    }, []);


                    $changeNeeded = $totalPaid - $totalPrice; // คำนวณเงินทอนที่ต้องคืน
                    $cashPaid = $this->cashLib::countDenoms($denomination); // แปลง array [1000, 10, 5] เป็น [1000 => 1, 10 => 1, 5 => 1]
                    $availableCash = $this->cashLib::mergeCash($cashInMachine, $cashPaid); // รวมเงินที่มีในเครื่องกับเงินที่ลูกค้าจ่าย
                    if ($changeNeeded == 0) {
                        $confirmBooking = $this->bookingLib->confirmBooking($booking_no);
                        if (!$confirmBooking['status']) {
                            return $this->response->setJSON([
                                'status' => false,
                                'error_code' => $confirmBooking['error_code'],
                                'message' => $confirmBooking['message'],
                            ]);
                        }

                        return $this->response->setJSON([
                            'status' => true,
                            'message' => 'Payment successful, no change needed',
                            'sumGivenChange' => 0,
                            'givenChange' => [],
                            'cashUpdated' => $availableCash,
                        ]);
                    } else {
                        $changeToGive = $this->cashLib::getChange($changeNeeded, $availableCash); // คำนวณเงินทอนที่ต้องคืน
                        if (empty($changeToGive)) {
                            return $this->response->setJSON([
                                'status' => false,
                                'error_code' => 'CANNOT_GIVE_CHANGE',
                                'message' => 'Cannot give change with available cash',
                            ]);
                        }
                        $sumGivenChange = array_sum(array_map(function ($denom, $qty) {
                            return $denom * $qty;
                        }, array_keys($changeToGive), $changeToGive));
                        $cashUpdated = $this->cashLib::updateAvailableCash($availableCash, $changeToGive);
                        $this->cashModel->updateCashQuantities($cashUpdated); // อัปเดตเงินในเครื่อง
                        $confirmBooking = $this->bookingLib->confirmBooking($booking_no);
                        if (!$confirmBooking['status']) {
                            return $this->response->setJSON([
                                'status' => false,
                                'error_code' => $confirmBooking['error_code'],
                                'message' => $confirmBooking['message'],
                            ]);
                        }

                        return $this->response->setJSON([
                            'status' => true,
                            'message' => 'Payment successful',
                            'sumGivenChange' => $sumGivenChange,
                            'givenChange' => $changeToGive,
                            'cashUpdated' => $cashUpdated,
                        ]);
                    }
                    break;
                case 'creditcard':
                case 'qr':
                default:
                    return $this->response->setJSON([
                        'status' => false,
                        'error_code' => 'INVALID_METHOD',
                        'message' => 'Invalid payment method',
                    ]);
            }
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500, 'Internal Server Error: ' . $e->getMessage());
        }
    }
}
