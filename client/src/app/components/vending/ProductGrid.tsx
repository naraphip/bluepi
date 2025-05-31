import { ProductCard } from '../ProductCard'
import { Product } from '@/interfaces/product'

interface Props {
  products: Product[]
  selectedIds: number[]
  onToggleSelect: (id: number) => void
}

export function ProductGrid({ products, selectedIds, onToggleSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
      {products.slice(0, 12).map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selected={selectedIds.includes(product.id)}
          onClick={() => onToggleSelect(product.id)}
        />
      ))}
    </div>
  )
}
