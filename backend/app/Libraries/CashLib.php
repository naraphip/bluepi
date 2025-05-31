<?php

namespace App\Libraries;

class CashLib
{
    /**
     * Merge the cash in the machine with the cash paid by the customer.
     * ฟังก์ชันรวมเงินในเครื่องกับเงินที่ลูกค้าจ่าย
     * @param array $cashInMachine The cash currently in the machine.
     * @param array $cashPaid The cash paid by the customer.
     * @return array Merged cash with denominations as keys and their counts as values.
     */
    public static function mergeCash(array $cashInMachine, array $cashPaid): array
    {
        $merged = $cashInMachine;

        foreach ($cashPaid as $denom => $count) { // ตรวจสอบว่ามีหน่วยเงินนี้อยู่ในเครื่องหรือไม่
            if (!isset($merged[$denom])) { // ตรวจสอบว่ามีหน่วยเงินนี้อยู่ในเครื่องหรือไม่
                $merged[$denom] = 0; // ถ้าไม่มีให้เริ่มนับจาก 0
            }
            $merged[$denom] += $count; // รวมจำนวนหน่วยเงินที่มีในเครื่องกับจำนวนที่ลูกค้าจ่าย
        }

        krsort($merged); // จัดเรียงจากแบงก์/เหรียญใหญ่ไปเล็ก
        return $merged;
    }

    /**
     * Count the denominations in the cash array.
     * แปลง array [1000, 10, 5] เป็น [1000 => 1, 10 => 1, 5 => 1]
     * @param array $cash The cash array containing denominations.
     * @return array An associative array with denominations as keys and their counts as values.
     */
    public static function countDenoms(array $cash): array
    {
        $result = [];
        foreach ($cash as $c) {
            if (!isset($result[$c])) { // ตรวจสอบว่ามีหน่วยเงินนี้อยู่ในผลลัพธ์หรือไม่
                $result[$c] = 0;  // ถ้าไม่มีให้เริ่มนับจาก 0
            }
            $result[$c]++; // เพิ่มจำนวนหน่วยเงินที่พบในผลลัพธ์
        }
        return $result;
    }

    /**
     * Get the change needed based on the available cash.
     * คำนวณเงินทอนจาก available cash
     * @param int $changeNeeded The amount of change needed.
     * @param array $availableCash The available cash denominations in the machine.
     * @return array|null Returns an associative array with denominations as keys and their counts as values, or null if change cannot be given.
     */
    public static function getChange(int $changeNeeded, array $availableCash): ?array
    {
        krsort($availableCash); // เรียงจากมากไปน้อย
        $change = [];

        foreach ($availableCash as $denom => $count) {
            if ($changeNeeded <= 0) break;

            $maxUse = intdiv($changeNeeded, $denom); // คำนวณจำนวนสูงสุดที่สามารถใช้ได้จากธนบัตร/เหรียญนั้น
            $use = min($maxUse, $count); // ใช้จำนวนที่มีในเครื่องน้อยกว่าหรือเท่ากับที่ต้องการ

            if ($use > 0) {
                $change[$denom] = $use;
                $changeNeeded -= $denom * $use;
            }
        }

        return $changeNeeded === 0 ? $change : null;
    }

    /**
     * Update the available cash after giving change.
     * อัปเดตเงินในเครื่องหลังจากทอนเงิน
     * @param array $availableCash The current available cash in the machine.
     * @param array $changeToGive The change to be given to the customer.
     * @return array Updated available cash after giving change.
     */
    public static function updateAvailableCash(array $availableCash, array $changeToGive): array
    {
        foreach ($changeToGive as $denom => $qty) {
            if (isset($availableCash[$denom])) {
                $availableCash[$denom] -= $qty;
                if ($availableCash[$denom] <= 0) {
                    unset($availableCash[$denom]);
                }
            }
        }
        return $availableCash;
    }
}
