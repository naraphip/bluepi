'use client'

import { Button } from '@/app/components/ui/Button'
import BookingService from '@/services/booking/BookingService'

export function PayButton({ selectedIds }: { selectedIds: number[] }) {
  const handleClick = () => {
    if (selectedIds.length > 0) {
      // call booking service
      const response: any = BookingService.booking({
        productIds: selectedIds,
      })

      response.then((res: any) => {
        if (res.status) {
          window.location.href = `/payment?token=${res.token}&booking_no=${res.data.booking_no}`
        } else {
          alert(res.message || 'เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง')
        }
      }).catch((error: any) => {
        console.error('Booking error:', error)
        alert('เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง')
      })
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={selectedIds.length === 0}
      className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-xl disabled:opacity-50 transition cursor-pointer w-full"
    >
      {selectedIds.length > 0 ? `ชำระเงิน (${selectedIds.length}) รายการ` : 'กรุณาเลือกสินค้า'}
    </Button>
  )
}
