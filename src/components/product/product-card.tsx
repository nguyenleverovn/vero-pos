import { Product } from '@/data/mock-products'
import { PrimaryButton } from '@/components/ui/button'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-lg border border-border bg-white p-3 shadow-card">
      <div className="text-sm uppercase tracking-wide text-gray-500">{product.category}</div>
      <h3 className="mt-1 text-base font-semibold">{product.name}</h3>
      <p className="mt-1 text-primary-700">{product.price.toLocaleString('vi-VN')} đ</p>
      <div className="mt-3">
        <PrimaryButton size="sm">Thêm</PrimaryButton>
      </div>
    </article>
  )
}
