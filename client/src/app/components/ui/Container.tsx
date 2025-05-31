'use client'

import { ReactNode } from 'react'

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[1200px] mx-auto md:py-0">
      {children}
    </div>
  )
}
