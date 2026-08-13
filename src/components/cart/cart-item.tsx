import { QuantityControl } from './quantity-control'

type CartItemProps = {
  name: string
  price: number
  qty: number
}

export function CartItem({ name, price, qty }: CartItemProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-gray-600">{price.toLocaleString('vi-VN')} đ / ly</div>
      </div>
      <div className="flex items-center gap-2">
        <QuantityControl />
        <span className="w-14 text-right text-sm">{qty}</span>
      </div>
    </div>
  )
}
