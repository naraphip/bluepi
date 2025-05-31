"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import Layout from "@/app/components/ui/Layout";
import { SelectedItemsSummary } from "@/app/components/vending/SelectedItemsSummary";
import { useSearchParams } from "next/navigation";
import BookingService from "@/services/booking/BookingService";
import paymentService from "@/services/payment/PaymentService";
import { PaymentSuccess } from "@/app/components/payment/PaymentSuccess";
import { PaymentFail } from "@/app/components/payment/PaymentFail";
import { PaymentError } from "@/app/components/payment/PaymentError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import clsx from "clsx";


export default function CashPaymentPageWrapper() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "default_token";

  const [products, setProducts] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [amountInput, setAmountInput] = useState(0);
  const [_cashInput, setCashInput] = useState<number[]>([]);
  const [givenChange, _setGivenChange] = useState<Record<string, number>>({});

  const [change, setChange] = useState(0);
  const [isEnough, setIsEnough] = useState(false);

  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusPayment, setStatusPayment] = useState<"success" | "fail" | null>(
    null
  );

  const [expanded, setExpanded] = useState(false);

  const handleAdd = (value: number) => {
    const newAmount = amountInput + value;
    const isEnoughPayment = newAmount >= totalPrice;

    setAmountInput(newAmount);
    setCashInput((prev) => [...prev, value]);
    setIsEnough(isEnoughPayment);
    setChange(isEnoughPayment ? newAmount - totalPrice : 0);
  };

  const handleReset = () => {
    setAmountInput(0);
    setCashInput([]);
    setIsEnough(false);
    setChange(0);
  };

  const handleConfirm = () => {
    if (isEnough) {
      const denomination = _cashInput.map((val) => parseInt(val.toString()));
      const paymentData = {
        token,
        method: "cash",
        denomination,
      };
      const handlePayment = async () => {
        try {
          const response: any = await paymentService.checkout(paymentData);
          if (response.status) {

            setStatusPayment("success");
            _setGivenChange(response.givenChange || {});
          } else {
            setStatusPayment("fail");
            setErrorMessage(response.message || "เกิดข้อผิดพลาดในการชำระเงิน");
          }
        } catch {
          setStatusPayment("fail");
          setErrorMessage("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
        }
      };
      handlePayment();
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response: any = await BookingService.bookingDetails({ token });
        setLoading(false);
        if (response.status) {
          setProducts(response.products);
          setSelectedIds(response.products.map((p: any) => p.id));
          setTotalPrice(parseFloat(response.amount));
        } else {
          setError(true);
          if (["ALREADY_PAID", "CANCELLED"].includes(response.error_code)) {
            setIsPaid(true);
          } else {
            setErrorMessage(
              response.message || "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง"
            );
          }
        }
      } catch {
        setError(true);
        setErrorMessage("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
      }
    };

    fetchBookingDetails();
  }, [token]);

  const renderPaymentSection = () => (
    <main className="relative min-h-screen flex flex-col items-center p-4 overflow-hidden">
      <h1 className="text-2xl w-full font-extrabold text-gray-600 mt-5 mb-5">
        ยืนยันการชำระเงิน
      </h1>

      <div className={clsx("flex flex-col md:flex-row w-full max-w-7xl gap-6")}>
        {/* เงินสด */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full">
            <h2 className="text-2xl font-bold text-center mb-4 text-indigo-700">
              ชำระด้วยเงินสด
            </h2>

            <div className="text-center mb-6">
              <p className="text-lg text-gray-700">
                ยอดที่ต้องชำระ:{" "}
                <span className="font-bold text-red-600">{totalPrice} บาท</span>
              </p>
              <p className="text-lg text-gray-700">
                เงินที่ใส่แล้ว:{" "}
                <span className="font-bold text-green-600">
                  {amountInput} บาท
                </span>
              </p>
              <p
                className={`text-md mt-2 font-medium ${
                  isEnough ? "text-indigo-600" : "text-red-600"
                }`}
              >
                {isEnough ? `เงินทอน: ${change} บาท` : "ยอดเงินไม่เพียงพอ"}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {[1, 5, 10, 20, 50, 100, 500, 1000].map((val) => (
                <Button
                  key={val}
                  onClick={() => handleAdd(val)}
                  className="bg-indigo-700 text-white py-2 rounded-xl hover:shadow-lg"
                >
                  +{val}฿
                </Button>
              ))}
            </div>

            <div className="flex justify-between gap-4">
              <Button
                onClick={handleReset}
                className="w-1/2 bg-gray-300 hover:bg-gray-400 text-black rounded-xl"
              >
                ล้าง
              </Button>
            </div>
          </div>
        </div>

        {/* สรุปสินค้า (เดสก์ท็อป) */}
        <div className="w-[300px] hidden md:block lg:w-[360px]">
          {products.length === 0 ? (
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-purple-200 text-center">
              กำลังโหลดข้อมูลการจอง...
            </div>
          ) : (
            <SelectedItemsSummary
              selectedIds={selectedIds}
              products={products}
            />
          )}
          <Button
            onClick={handleConfirm}
            disabled={!isEnough}
            className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-xl disabled:opacity-50 transition cursor-pointer w-full"
          >
            ยืนยันการชำระเงิน
          </Button>
        </div>

        {/* Sticky Mobile Footer */}
        <div className="fixed bottom-0 left-0 w-full bg-white z-50 md:hidden rounded-t-2xl shadow-lg">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 text-left text-gray-800 font-semibold"
          >
            <div className="flex items-center justify-between">
              <span>{expanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={expanded ? "M1 1L7 7L13 1" : "M13 7L7 1L1 7"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
          {expanded && (
            <div className="p-4">
              <SelectedItemsSummary
                selectedIds={selectedIds}
                products={products}
                isMobile
              />
            </div>
          )}
          <div className="p-4">
            <Button
              onClick={handleConfirm}
              disabled={!isEnough}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-xl disabled:opacity-50"
            >
              ยืนยันการชำระเงิน
            </Button>
          </div>
        </div>
      </div>
    </main>
  );

  return (
  <Layout>
    {loading ? (
      <div className="flex items-center justify-center min-h-screen p-4">
        <LoadingSpinner message="กำลังโหลดข้อมูลการจอง..." />
      </div>
    ) : isPaid ? (
      <PaymentSuccess />
    ) : error ? (
      <PaymentError message={errorMessage} />
    ) : statusPayment === "success" ? (
      <PaymentSuccess
        change={change}
        givenChange={givenChange}
        cash={true}
      />
    ) : statusPayment === "fail" ? (
      <PaymentFail message={errorMessage} />
    ) : (
      renderPaymentSection()
    )}
  </Layout>
);

}
