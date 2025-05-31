'use client'

import { Suspense } from 'react'
import CashPaymentPageWrapper from './CashPaymentPageWrapper'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CashPaymentPageWrapper />
    </Suspense>
  )
}