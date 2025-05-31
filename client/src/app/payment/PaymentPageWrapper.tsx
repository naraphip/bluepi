"use client";

import { useState, useEffect } from "react";
import { PaymentMethodSelector } from "@/app/components/payment/PaymentMethodSelector";
import { Button } from "@/app/components/ui/Button";
import Layout from "../components/ui/Layout";
import { SelectedItemsSummary } from "@/app/components/vending/SelectedItemsSummary";
import BookingService from "@/services/booking/BookingService";
import { useSearchParams } from "next/navigation";
import { PaymentSuccess } from "../components/payment/PaymentSuccess";
import { PaymentError } from "../components/payment/PaymentError";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";


export default function PaymentPageWrapper() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "default_token"; // ใช้ token จาก URL หรือค่าเริ่มต้น

  const [isPaid, setIsPaid] = useState(false); // ใช้สำหรับตรวจสอบว่าการชำระเงินเสร็จสมบูรณ์หรือไม่
  const [error, setError] = useState(false); // สำหรับเก็บข้อความแสดงข้อผิดพลาด
  const [errorMessage, setErrorMessage] = useState<string>(""); // สำหรับเก็บข้อความแสดงข้อผิดพลาด
  const [loading, setLoading] = useState(true); // ใช้สำหรับแสดงสถานะการโหลดข้อมูล

  const [method, setMethod] = useState<"cash" | "qr" | "credit" | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState([]); // สมมุติว่าเรามีข้อมูลสินค้าใน state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleConfirm = () => {
    if (!method) return;

    // หากเลือก "เงินสด" ให้เข้ารหัส product เป็น base64
    if (method === "cash") {
      window.location.href = `/payment/cash?token=${token}`;
    }

    // สำหรับ method อื่นอาจ redirect ไปหน้าอื่นในอนาคต
  };

  // ดึงข้อมูลการจองเมื่อโหลดหน้า
  useEffect(() => {
    const fetchBookingDetails = async () => {
      const response: any = await BookingService.bookingDetails({
        token: token,
      });
      setLoading(false); // ตั้งค่า loading เป็น false หลังจากดึงข้อมูลเสร็จ
      if (response.status) {
        // Handle successful response
        setProducts(response.products); // สมมุติว่า response มีข้อมูลสินค้า
        const filteredProductIds = response.products.map(
          (product: any) => product.id
        );
        setSelectedIds(filteredProductIds); // เก็บเฉพาะ ID ของสินค้า
      } else {
        setError(true);
        if (
          response.error_code === "ALREADY_PAID" ||
          response.error_code === "CANCELLED"
        ) {
          setIsPaid(true);
        } else {
          setErrorMessage(
            response.message || "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง"
          );
        }
      }
    };

    fetchBookingDetails();
  }, [token]); // ใช้ token จาก URL เพื่อดึงข้อมูลการจอง

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <LoadingSpinner message="กำลังโหลดข้อมูลการจอง..." />
        </div>
      ) : !isPaid ? (
        error ? (
          <PaymentError message={errorMessage} />
        ) : (
          <main className="relative min-h-screen flex flex-col items-center p-4 overflow-hidden">
            <h1 className="text-2xl font-extrabold bg-clip-text w-full text-start text-gray-600 mt-5 mb-5 drop-shadow-md">
              ช่องทางการชำระเงิน
            </h1>

            <div className="flex flex-col md:flex-row w-full max-w-7xl gap-6">
              {/* สินค้า */}
              <div className="flex-1">
                <PaymentMethodSelector selected={method} onSelect={setMethod} />
              </div>

              {/* Desktop Sidebar */}
              <div className="w-[300px] hidden md:block lg:w-[360px]">
                {products.length === 0 ? (
                  <div className="bg-white backdrop-blur-md shadow-xl rounded-2xl p-4 mb-6 border border-purple-200">
                    <p>กำลังโหลดข้อมูลการจอง...</p>
                  </div>
                ) : (
                  <SelectedItemsSummary
                    selectedIds={selectedIds}
                    products={products}
                  />
                )}

                <Button
                  onClick={handleConfirm}
                  disabled={!method}
                  className="w-full bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-600 text-white text-lg py-3 rounded-xl hover:shadow-xl transition disabled:opacity-50"
                >
                  ยืนยันการชำระเงิน
                </Button>
              </div>

              {/* Mobile Sticky Bottom Panel */}
              <div className="fixed bottom-0 left-0 w-full bg-white z-50 overflow-hidden md:hidden rounded-t-2xl shadow-lg">
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="w-full px-4 py-3 text-left text-gray-800 font-semibold"
                >
                  <div className="flex items-center justify-between">
                    <span> {expanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}</span>

                    {expanded ? (
                      <svg
                        className="w-4 h-4 text-gray-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 8"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 8"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                {expanded && (
                  <div className="p-4">
                    <SelectedItemsSummary
                      selectedIds={selectedIds}
                      products={products}
                      isMobile={true}
                    />
                  </div>
                )}
                <div className="p-4">
                  <Button
                    onClick={handleConfirm}
                    disabled={!method}
                    className="w-full bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-600 text-white text-lg py-3 rounded-xl hover:shadow-xl transition disabled:opacity-50"
                  >
                    ยืนยันการชำระเงิน
                  </Button>
                </div>
              </div>
            </div>
          </main>
        )
      ) : (
        <PaymentSuccess />
      )}
    </Layout>
  );
}
