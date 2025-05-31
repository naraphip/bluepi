<?php

namespace App\Libraries;

class BookingLib
{
    protected $db;
    protected $productModel;
    protected $transactionModel;

    public function __construct()
    {
        helper(['encode_url', 'booking']);
        $this->db = \Config\Database::connect();
        $this->productModel = new \App\Models\ProductsModel;
        $this->transactionModel = new \App\Models\TransactionsModel();
    }

    /**
     * Create a booking for a product.
     *
     * @param object $data Booking data containing productId, bookingDate, and bookingTime.
     * @return array Response indicating success or failure of the booking creation.
     */
    public function booking(object $request): array
    {
        try {
            if (empty($request) || empty($request->productIds)) {
                return [
                    'status' => false,
                    'error_code' => 'INVALID_PRODUCT_ID',
                    'message' => 'Invalid product ID',
                ];
            }

            $checkProducts = $this->checkProducts($request->productIds);
            if (!$checkProducts['status']) {
                return [
                    'status' => false,
                    'error_code' => $checkProducts['error_code'] ?? 'PRODUCT_CHECK_FAILED',
                    'message' => $checkProducts['message'],
                    'data' => $checkProducts['data'] ?? [],
                ];
            }

            $products = $checkProducts['data'];
            $booking_no = generate_booking_no();
            $totalPrice = 0;
            foreach ($products as $row) {
                $totalPrice += $row->price;
            }

            $dataEncode = array(
                'booking_no' => $booking_no,
                'amount' => $totalPrice,
            );

            $token = encode_booking_token(json_encode($dataEncode, JSON_UNESCAPED_UNICODE));
            if (empty($token)) {
                return [
                    'status' => false,
                    'error_code' => 'BOOKING_URL_GENERATION_FAILED',
                    'message' => 'Failed to generate booking URL',
                ];
            }

            $data = [
                'booking_no' => $booking_no,
                'product_ids' => $request->productIds,
                'amount' => $totalPrice,
                'booking_date' => date('Y-m-d'),
                'booking_time' => date('H:i:s'),
            ];

            $transactionResult = $this->createTransaction($data);
            if (!$transactionResult['status']) {
                return [
                    'status' => false,
                    'error_code' => $transactionResult['error_code'] ?? 'TRANSACTION_CREATION_FAILED',
                    'message' => $transactionResult['message'],
                ];
            }

            return [
                'status' => true,
                'message' => 'Booking created successfully',
                'data' => array(
                    'booking_no' => $booking_no,
                    'amount' => $totalPrice
                ),
                'token' => $token,
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error_code' => 'INTERNAL_ERROR',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Check if products are available and in stock.
     *
     * @param array $productIds Array of product IDs to check.
     * @return array Response indicating the status of the products.
     */
    public function checkProducts(array $productIds): array
    {
        try {
            // ค้นหาสินค้าในฐานข้อมูล
            $productIds = is_array($productIds) ? $productIds : [$productIds];
            $products = $this->productModel->whereIn('id', $productIds)->where('status', 1)->findAll();
            if (empty($products)) {
                return [
                    'status' => false,
                    'error_code' => 'PRODUCT_NOT_FOUND',
                    'message' => 'No products found or all products are inactive',
                ];
            }

            // ตรวจสอบว่าจำนวนสินค้าที่ค้นหาเท่ากับจำนวนที่ส่งมา
            if (count($products) !== count($productIds)) {
                return [
                    'status' => false,
                    'error_code' => 'PRODUCT_NOT_FOUND',
                    'message' => 'Some products are not found or inactive',
                ];
            }

            // ตรวจสอบสต็อกของสินค้า
            $outOfStock = array_filter($products, function ($product) {
                return $product->stock == 0;
            });

            // ถ้ามีสินค้าที่ไม่มีสต็อก ให้คืนค่าข้อความแจ้งเตือน
            if (!empty($outOfStock)) {
                return [
                    'status' => false,
                    'error_code' => 'OUT_OF_STOCK',
                    'data' => $outOfStock,
                    'message' => 'The following products are out of stock: ' . implode(', ', array_column($outOfStock, 'name'))
                ];
            }

            return [
                'status' => true,
                'data' => $products,
                'message' => 'All products are available',
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error_code' => 'INTERNAL_ERROR',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Confirm a booking by booking number.
     *
     * @param string $booking_no The booking number to confirm.
     * @return array Response indicating success or failure of the booking confirmation.
     */
    public function confirmBooking(string $booking_no): array
    {
        try {
            $transaction = $this->transactionModel->where('booking_no', $booking_no)->first();
            if (!$transaction) {
                return [
                    'status' => false,
                    'error_code' => 'BOOKING_NOT_FOUND',
                    'message' => 'Booking not found',
                ];
            }

            // Update the payment status to confirmed (1)
            $this->transactionModel->update($transaction->id, ['payment_status' => 1]);
            $allocatedData = json_decode($transaction->allocated_data, true);
            if (empty($allocatedData['product_ids'])) {
                return [
                    'status' => false,
                    'error_code' => 'NO_PRODUCTS_ALLOCATED',
                    'message' => 'No products allocated for this booking',
                ];
            }

            $updateStockResult = $this->updateStockByBookingNo($transaction->booking_no);
            if (!$updateStockResult['status']) {
                return [
                    'status' => false,
                    'error_code' => $updateStockResult['error_code'] ?? 'STOCK_UPDATE_FAILED',
                    'message' => $updateStockResult['message'],
                ];
            }

            return [
                'status' => true,
                'message' => 'Booking confirmed successfully',
                'data' => $transaction,
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error_code' => 'INTERNAL_ERROR',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Create a transaction for the booking.
     *
     * @param array $data Booking data including booking_no, product_ids, booking_date, booking_time, and amount.
     * @return array Response indicating success or failure of the transaction creation.
     */
    private function createTransaction(array $data): array
    {
        try {
            $dataAllocated = [
                'booking_no' => $data['booking_no'],
                'product_ids' => $data['product_ids'],
                'booking_date' => $data['booking_date'] ?? date('Y-m-d'),
                'booking_time' => $data['booking_time'] ?? date('H:i:s'),
            ];

            $dataInsert = [
                'booking_no' => $data['booking_no'],
                'amount' => $data['amount'],
                'payment_status' => 0, // pending
                'allocated_data' => json_encode($dataAllocated, JSON_UNESCAPED_UNICODE),
            ];

            // Insert booking data into the transactions table
            $transactionId = $this->transactionModel->insert($dataInsert);
            if (!$transactionId) {
                return [
                    'status' => false,
                    'error_code' => 'TRANSACTION_INSERT_FAILED',
                    'message' => 'Failed to insert transaction data',
                ];
            }

            return [
                'status' => true,
                'message' => 'Transaction created successfully',
                'data' => $dataInsert,
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error_code' => 'TRANSACTION_CREATION_FAILED',
                'message' => 'Failed to create transaction: ' . $e->getMessage(),
            ];
        }
    }


    // get transaction by booking number
    public function getTransactionByBookingNo(string $booking_no): array
    {
        try {
            $transaction = $this->transactionModel->where('booking_no', $booking_no)->first();
            if (!$transaction) {
                return [
                    'status' => false,
                    'error_code' => 'TRANSACTION_NOT_FOUND',
                    'message' => 'Transaction not found for booking number: ' . $booking_no,
                ];
            }

            return [
                'status' => true,
                'data' => $transaction,
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error_code' => 'INTERNAL_ERROR',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ];
        }
    }

    // Get products by booking number.
    /**
     * Get products associated with a booking number.
     *
     * @param string $booking_no The booking number to retrieve products for.
     * @return array Response containing the products or an error message.
     */
    public function getProductsByBookingNo(string $booking_no): array
    {
        try {
            $transaction = $this->getTransactionByBookingNo($booking_no);
            if (!$transaction['status']) {
                return $transaction; // Return the error response
            }

            $allocatedData = json_decode($transaction['data']->allocated_data, true);
            if (empty($allocatedData['product_ids'])) {
                return [
                    'status' => false,
                    'error_code' => 'NO_PRODUCTS_ALLOCATED',
                    'message' => 'No products allocated for this booking',
                ];
            }

            $products = $this->productModel->select('id, name, sku, image_url, description, price, stock')
                ->whereIn('id', $allocatedData['product_ids'])->findAll();
            return [
                'status' => true,
                'data' => $products,
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error_code' => 'INTERNAL_ERROR',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Update product stock after bookink by booking number.
     *
     * @param string $booking_no The booking number for which the stock needs to be updated.
     * @return array Response indicating success or failure of the stock update.
     */
    public function updateStockByBookingNo(string $booking_no): array
    {
        try {
            $transaction = $this->getTransactionByBookingNo($booking_no);
            if (!$transaction['status']) {
                return $transaction; // Return the error response
            }

            if ($transaction['data']->payment_status != 1) {
                return [
                    'status' => false,
                    'error_code' => 'BOOKING_NOT_CONFIRMED',
                    'message' => 'Booking has not been confirmed yet',
                ];
            }

            $allocatedData = json_decode($transaction['data']->allocated_data, true);
            if (empty($allocatedData['product_ids'])) {
                return [
                    'status' => false,
                    'error_code' => 'NO_PRODUCTS_ALLOCATED',
                    'message' => 'No products allocated for this booking',
                ];
            }

            // Update stock for each product
            foreach ($allocatedData['product_ids'] as $productId) {
                $this->productModel->decreaseStock($productId);
            }

            return [
                'status' => true,
                'message' => 'Stock updated successfully for booking number: ' . $booking_no,
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'error_code' => 'INTERNAL_ERROR',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ];
        }
    }
}
