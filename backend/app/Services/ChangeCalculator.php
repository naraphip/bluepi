<?php

namespace App\Services;

use App\Models\CashModel;

class ChangeCalculator
{
    public function calculateChange(int $changeAmount): array
    {
        $cashModel = new CashModel();
        $availableCash = $cashModel->getCashDescending();

        $change = [];
        foreach ($availableCash as $cash) {
            $denomination = $cash->denomination;
            $maxQty = floor($changeAmount / $denomination); // คำนวณจำนวนสูงสุดที่สามารถใช้ได้จากธนบัตร/เหรียญนั้น
            $useQty = min($maxQty, $cash->quantity); // ใช้จำนวนที่มีในเครื่องน้อยกว่าหรือเท่ากับที่ต้องการ
            if ($useQty > 0) {
                $change[] = ['denomination' => $denomination, 'quantity' => $useQty];
                $changeAmount -= $denomination * $useQty;
            }
        }

        if ($changeAmount > 0) {
            throw new \Exception("ไม่สามารถทอนเงินได้");
        }

        return $change;
    }

    function canGiveChange(int $change, array $cashInMachine): array|null
    {
        krsort($cashInMachine); // เรียงจากธนบัตร/เหรียญใหญ่ไปเล็ก
        $changeToGive = [];

        foreach ($cashInMachine as $denom => $count) {
            if ($change <= 0) break;
            $numNeeded = intdiv($change, $denom); // คำนวณจำนวนที่ต้องการทอน intdiv หมายถึงหารปัดเศษลง
            $numToUse = min($numNeeded, $count); // ใช้จำนวนที่มีในเครื่องน้อยกว่าหรือเท่ากับที่ต้องการ
            if ($numToUse > 0) {
                $changeToGive[$denom] = $numToUse;
                $change -= $denom * $numToUse;
            }
        }

        return $change === 0 ? $changeToGive : null; // ถ้าทอนได้พอดี
    }
}
