"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/app/components/vending/ProductGrid";
import { PayButton } from "@/app/components/vending/PayButton";
import { SelectedItemsSummary } from "@/app/components/vending/SelectedItemsSummary";
import Layout from "./components/ui/Layout";
import ProductService from "@/services/product/ProductService";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

// const products = [
//   {
//     id: 1,
//     name: "น้ำแร่ธรรมชาติ",
//     sku: "SKU001",
//     image_url: "https://example.com/images/water.jpg",
//     description: "น้ำแร่บริสุทธิ์จากธรรมชาติ ขนาด 600ml",
//     price: 10.00,
//     stock: 50
//   },
//   {
//     id: 2,
//     name: "มันฝรั่งทอดกรอบ",
//     sku: "SKU002",
//     image_url: "https://example.com/images/chips.jpg",
//     description: "มันฝรั่งทอดกรอบ รสชีส ขนาด 40g",
//     price: 25.00,
//     stock: 30
//   },
//   {
//     id: 3,
//     name: "ชาเขียวเย็น",
//     sku: "SKU003",
//     image_url: "https://example.com/images/greentea.jpg",
//     description: "ชาเขียวญี่ปุ่น หวานน้อย ขนาด 500ml",
//     price: 20.00,
//     stock: 40
//   },
//   {
//     id: 4,
//     name: "ช็อกโกแลตแท่ง",
//     sku: "SKU004",
//     image_url: "https://example.com/images/chocolate.jpg",
//     description: "ช็อกโกแลตนมคุณภาพ ขนาด 35g",
//     price: 15.00,
//     stock: 25
//   },
//   {
//     id: 5,
//     name: "กาแฟกระป๋อง",
//     sku: "SKU005",
//     image_url: "https://example.com/images/coffee.jpg",
//     description: "กาแฟดำพร้อมดื่ม รสเข้ม ขนาด 240ml",
//     price: 18.00,
//     stock: 0
//   }
// ];
const PRODUCTS_PER_PAGE = 9;

export default function VendingMachinePage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState([]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    // const response: any = await ProductService.getAllProducts()
    const fetchProducts = async () => {
      try {
        const response: any = await ProductService.getAllProducts();
        if (response && response.data) {
          setProducts(response.data);
        } else {
          console.error("No products found");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Layout showFooter={true}>
      <main className="relative min-h-screen flex flex-col items-center p-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse -z-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-200 -z-10"></div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold bg-clip-text w-full text-start text-gray-600 mt-5 mb-5 drop-shadow-md">
          ตู้จำหน่ายสินค้าอัตโนมัติ
        </h1>

        {/* add loading  */}
        {products.length === 0 ? (
          <div className="flex items-center justify-center min-h-screen p-4">
            <LoadingSpinner message="กำลังโหลดข้อมูลสินค้า..." fullscreen={true} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row w-full max-w-7xl gap-6">
            {/* สินค้า */}
            <div className="flex-1">
              <ProductGrid
                products={paginatedProducts}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 mb-8 gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 flex gap-2 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-6 h-6 hidden md:block text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 5H1m0 0 4 4M1 5l4-4"
                    />
                  </svg>
                  ก่อนหน้า
                </button>

                <span className="text-lg font-semibold text-gray-800">
                  หน้า <span className="text-indigo-600">{currentPage}</span> /{" "}
                  {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 flex gap-2 rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ถัดไป{" "}
                  <svg
                    className="w-6 h-6 hidden md:block text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="w-[300px] hidden md:block lg:w-[360px]">
              <SelectedItemsSummary
                selectedIds={selectedIds}
                products={products}
              />
              <PayButton selectedIds={selectedIds} />
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
                <PayButton selectedIds={selectedIds} />
              </div>
            </div>
          </div>
        )}

        {/* Pay Button */}
      </main>
    </Layout>
  );
}
