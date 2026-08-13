export function CartSummary({ total = 0 }: { total: number }) {
  return (
    <div className="mt-4 rounded-md bg-primary-50 p-3 text-sm">
      <p className="text-gray-600">Tổng tạm tính</p>
      <p className="mt-1 text-xl font-semibold">{total.toLocaleString('vi-VN')} đ</p>
    </div>
  )
}
