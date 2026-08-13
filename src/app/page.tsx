import { AppHeader } from '@/components/layout/app-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutContainer } from '@/components/layout/layout-container'

export default function HomePage() {
  return (
    <div className="app-shell">
      <AppHeader />
      <LayoutContainer className="py-6">
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <h2 className="text-xl font-semibold text-foreground">Product Rail</h2>
            <p className="mt-3 text-sm text-muted">
              Khu vực này sẽ bám Figma để render danh mục món và trạng thái chọn nhanh.
              Chúng ta sẽ triển khai phần Product logic ở task kế tiếp.
            </p>
            <div className="mt-4">
              <Button variant="primary">Chọn sản phẩm</Button>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-foreground">Order Canvas</h2>
            <p className="mt-3 text-sm text-muted">
              Khu vực này là nền cho giỏ hàng, tổng tiền và checkout. Chưa thêm
              business logic hay backend.
            </p>
            <div className="mt-4">
              <Button variant="secondary">Tạo đơn hàng mới</Button>
            </div>
          </Card>
        </div>
      </LayoutContainer>
    </div>
  )
}
