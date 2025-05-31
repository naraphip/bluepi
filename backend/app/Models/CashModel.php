<?php

namespace App\Models;

use CodeIgniter\Model;

class CashModel extends Model
{
    protected $table      = 'cash';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;

    protected $returnType     = 'object';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['denomination', 'quantity'];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // Dates
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    public function getCashDescending()
    {
        return $this->where('quantity >', 0)
                    ->orderBy('denomination', 'DESC')
                    ->findAll();
    }

    public function updateCashQuantities(array $cashArray): void
    {
        foreach ($cashArray as $denomination => $quantity) {
            // ค้นหา row ที่มี denomination นี้อยู่แล้ว
            $row = $this->where('denomination', $denomination)->first();

            if ($row) {
                // อัปเดต quantity
                $this->update($row->id, [
                    'quantity'   => $quantity,
                ]);
            } else {
                // ถ้ายังไม่มีให้ insert ใหม่
                $this->insert([
                    'denomination' => $denomination,
                    'quantity'     => $quantity,
                ]);
            }
        }
    }
}