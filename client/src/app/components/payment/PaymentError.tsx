import React from 'react';

export function PaymentError({ message }: { message?: string }) {

    const tryAgain = () => {
        window.location.href = '/';
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-red-100 to-white border border-red-300 rounded-3xl shadow-2xl">
            <div className="flex flex-col gap-5 justify-center items-center">
                <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-700">
                        เกิดข้อผิดพลาดในการดึงข้อมูล
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                        ขออภัย ระบบไม่สามารถดำเนินการชำระเงินของคุณได้
                        <br />
                        {message ? message : 'กรุณาลองอีกครั้งในภายหลัง'}
                    </p>
                </div>
            </div>
            <div className="mt-6 text-center">
                <button 
                    onClick={tryAgain}
                    className="px-6 py-2 bg-red-600 cursor-pointer hover:bg-red-700 text-white text-sm rounded-full transition duration-200 shadow-md"
                >
                    กลับหน้าแรก
                </button>
            </div>
        </div>
    );
}
