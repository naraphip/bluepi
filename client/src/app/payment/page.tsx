'use client'

import { Suspense } from 'react'
import PaymentPageWrapper from './PaymentPageWrapper'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageWrapper />
    </Suspense>
  )
}