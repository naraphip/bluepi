'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoneyUnit } from '@/app/interfaces/money';

export default function SuccessPage() {
  const router = useRouter();
  const [change, setChange] = useState<MoneyUnit[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('change');
    if (data) setChange(JSON.parse(data));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">ซื้อสินค้าสำเร็จ</h1>
      <p className="mb-2">ขอบคุณที่ใช้บริการ</p>
      <div>
        <p className="font-semibold">เงินทอน:</p>
        {change.length > 0 ? (
          <ul className="list-disc ml-6">
            {change.map(c => (
              <li key={c.denomination}>{c.denomination} บาท x {c.quantity}</li>
            ))}
          </ul>
        ) : <p>ไม่มีเงินทอน</p>}
      </div>

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => router.push('/')}
      >
        กลับหน้าแรก
      </button>
    </main>
  );
}