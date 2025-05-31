import { Product } from '@/interfaces/product'
import clsx from 'clsx'

interface Props {
    selectedIds: number[]
    products: Product[]
    isMobile?: boolean
}

export function SelectedItemsSummary({ selectedIds, products, isMobile }: Props) {
    // const selectedProducts = products.filter((p) => selectedIds.includes(p.id))
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id))
    // const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0)
    // แปลง price เป็น float เพื่อป้องกันปัญหาการคำนวณที่ไม่แม่นยำ
    const totalPrice = selectedProducts.reduce((sum, p: any) => sum + parseFloat(p.price), 0).toFixed(2)
    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่

    // if (selectedProducts.length === 0) return null

    return (
        <div className={clsx(
            'bg-white backdrop-blur-md',
            isMobile
                ? 'bg-indigo-100 border-indigo-500'
                : 'shadow-xl rounded-2xl p-4 mb-6 border border-purple-200'
        )}>
            <h2 className="text-xl font-semibold text-indigo-700 mb-3">สินค้าในตะกร้า</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {selectedProducts.map((product) => (
                    <li key={product.id} className="flex justify-between text-sm">
                        <span>{product.name}</span>
                        <span className="text-right text-indigo-600 font-medium">{product.price} บาท</span>
                    </li>
                ))}
            </ul>
            <div className="border-t pt-2 mt-3 flex justify-between text-indigo-900 font-bold">
                <span>รวมทั้งหมด</span>
                <span>{totalPrice} บาท</span>
            </div>
        </div>
    )
}
