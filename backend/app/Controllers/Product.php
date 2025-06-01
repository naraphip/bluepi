<?php

namespace App\Controllers;

class Product extends BaseController
{
    protected $db;
    protected $productModel;
    
    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->productModel = new \App\Models\ProductsModel();
    }

    public function index()
    {
        try {
            $products = $this->productModel->select('id, name, sku, image_url, description, price, stock')
                ->where('status', 1)
                ->orderBy('created_at', 'DESC')
                ->orderBy('stock', 'DESC')
                ->findAll();
            return $this->response->setJSON([
                'status' => true,
                'data' => $products,
            ]);
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Internal Server Error: ' . $e->getMessage(),
            ]);
        }
    }
}
