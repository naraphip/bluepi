import React from "react";

interface PaymentSuccessProps {
  cash?: boolean;
  qr?: boolean;
  credit?: boolean;
  givenChange?: Record<string, number>;
  change?: number;
}

export function PaymentSuccess(props: PaymentSuccessProps) {
  const backToHome = () => {
    window.location.href = "/";
  };

  console.log("PaymentSuccess props:", props.givenChange? props.givenChange : "No change given");

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-green-100 to-white border border-green-300 rounded-3xl shadow-2xl">
      <div className="flex flex-col gap-5 justify-center items-center space-x-4">
        <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-700">ชำระเงินสำเร็จ</h2>
          {props.givenChange !== undefined && (
            <div className="text-gray-800 text-1xl mt-1">
              <span className="font-bold">เงินทอน: {props?.change} บาท</span>
              <ul className="list-disc list-inside">
                {Object.entries(props.givenChange)
                  .sort((a, b) => Number(b[0]) - Number(a[0]))
                  .map(([denom, qty]) => (
                    <li key={denom}>
                      {denom} x {qty}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {props.qr && (
            <p className="text-green-600 text-sm mt-1">
              การชำระเงินผ่าน QR Code สำเร็จ
            </p>
          )}
          {props.credit && (
            <p className="text-green-600 text-sm mt-1">
              การชำระเงินผ่านบัตรเครดิตสำเร็จ
            </p>
          )}
          {/*
          <p className="text-green-600 text-sm mt-1">
            ขอบคุณที่ใช้บริการของเรา
          </p>
         */}
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={backToHome}
          className="px-6 py-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white text-sm rounded-full transition duration-200 shadow-md"
        >
          กลับหน้าแรก
        </button>
      </div>
    </div>
  );
}
