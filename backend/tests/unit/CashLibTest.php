<?php

namespace App\Libraries;

use CodeIgniter\Test\CIUnitTestCase;

class CashLibTest extends CIUnitTestCase
{
    public function testMergeCash()
    {
        $cashInMachine = [100 => 2, 50 => 1];
        $cashPaid = [100 => 1, 20 => 2];

        $expected = [100 => 3, 50 => 1, 20 => 2];

        $this->assertSame($expected, CashLib::mergeCash($cashInMachine, $cashPaid));
    }

    public function testCountDenoms()
    {
        $input = [1000, 20, 20, 10, 5];
        $expected = [1000 => 1, 20 => 2, 10 => 1, 5 => 1];

        $this->assertSame($expected, CashLib::countDenoms($input));
    }

    public function testGetChangeExact()
    {
        $changeNeeded = 70;
        $availableCash = [100 => 1, 50 => 1, 20 => 2];

        $expected = [50 => 1, 20 => 1];

        $this->assertSame($expected, CashLib::getChange($changeNeeded, $availableCash));
    }

    public function testGetChangeImpossible()
    {
        $changeNeeded = 30;
        $availableCash = [20 => 1, 5 => 1]; // มีแค่ 25 บาท

        $this->assertNull(CashLib::getChange($changeNeeded, $availableCash));
    }

    public function testUpdateAvailableCash()
    {
        $availableCash = [100 => 2, 50 => 1, 20 => 2];
        $changeToGive = [100 => 1, 20 => 1];

        $expected = [100 => 1, 50 => 1, 20 => 1];

        $this->assertSame($expected, CashLib::updateAvailableCash($availableCash, $changeToGive));
    }

    public function testUpdateAvailableCashRemoveDenomination()
    {
        $availableCash = [100 => 1, 50 => 1];
        $changeToGive = [100 => 1];

        $expected = [50 => 1];

        $this->assertSame($expected, CashLib::updateAvailableCash($availableCash, $changeToGive));
    }
}
