import clsx from 'clsx'
import { CreditCard, QrCode, Wallet } from 'lucide-react'

const methods = [
  { id: 'cash', label: 'เงินสด', icon: Wallet, status: 'available' },
  { id: 'qr', label: 'QR Code', icon: QrCode, status: 'unavailable' },
  { id: 'credit', label: 'บัตรเครดิต', icon: CreditCard, status: 'unavailable' },
] as const

type Method = typeof methods[number]['id']

export function PaymentMethodSelector({
  selected,
  onSelect,
}: {
  selected: Method | null
  onSelect: (m: Method) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white backdrop-blur-md shadow-xl rounded-2xl p-4 border border-purple-200">
      {methods.map(({ id, label, icon: Icon, status }) => {
        const isDisabled = status === 'unavailable'
        const isSelected = selected === id && !isDisabled

        return (
          <button
            key={id}
            onClick={() => !isDisabled && onSelect(id)}
            disabled={isDisabled}
            className={clsx(
              'flex flex-col items-center justify-center p-4 border rounded-xl transition',
              isDisabled
                ? 'opacity-50 cursor-not-allowed bg-[#e2e2e2] hover:shadow-none'
                : 'hover:bg-indigo-50 cursor-pointer hover:shadow-md',
              isSelected
                ? 'bg-[#efecff] ring-1 ring-indigo-500'
                : 'border-gray-300'

            )}
          >
            <Icon className="w-8 h-8 mb-2 text-indigo-600" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
