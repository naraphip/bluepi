import Image from 'next/image'
import clsx from 'clsx'
import { Product } from '@/interfaces/product'

export function ProductCard({
  product,
  selected,
  onClick,
}: {
  product: Product
  selected: boolean
  onClick: () => void
}) {
  const lowStock = product.stock <= 2

  return (
    <div
      onClick={product.stock > 0 ? onClick : undefined}
      className={clsx(
        product.stock <= 0 ? 'opacity-50 cursor-not-allowed rounded-2xl p-4 border border-gray-200 bg-gray-300' : 
        selected && 'ring-2 ring-indigo-500', 'cursor-pointer bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-gray-200'
      )}
    >
      <div className="flex justify-center mb-3">
        <Image
          src={product.image_url}
          alt={product.name}
          width={100}
          height={100}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.price} บาท</p>
        <p
          className={clsx(
            'text-xs font-medium',
            lowStock ? 'text-red-600' : 'text-green-600'
          )}
        >
          สินค้าคงเหลือ: {product.stock} ชิ้น
        </p>
      </div>
    </div>
  )
}
