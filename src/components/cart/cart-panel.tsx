import { CartItem } from './cart-item'
import { CartSummary } from './cart-summary'
import { PrimaryButton } from '@/components/ui/button'

const cartItems = [
  { name: 'Bạc xỉu đá', price: 28000, qty: 1 },
  { name: 'Trà đào cam sả', price: 36000, qty: 2 }
]

export function CartPanel() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="flex h-full flex-col">
      <div className="grow">
        {cartItems.map((item) => (
          <CartItem key={item.name} {...item} />
        ))}
      </div>
      <CartSummary total={total} />
      <div className="mt-3">
        <PrimaryButton className="w-full">Thanh toán</PrimaryButton>
      </div>
      <p className="mt-2 text-xs text-gray-500">Scope V1: UI shell, product/cart/checkout flow. Không có login/backend/cloud.</p>
    </div>
  )
}
