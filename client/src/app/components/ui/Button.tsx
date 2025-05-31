// components/ui/button.tsx
import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  const base = 'rounded-xl font-semibold transition duration-200 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-indigo-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
