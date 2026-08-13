import { products } from '@/data/mock-products'
import { AppHeader } from '@/components/layout/app-header'
import { ProductGrid } from '@/components/product/product-grid'
import { CartPanel } from '@/components/cart/cart-panel'

export default function PosPage() {
  return (
    <main className="app-shell min-h-screen">
      <AppHeader />
      <section className="mx-auto w-full max-w-[1280px] px-4 py-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="hero-soft p-4 md:p-6">
          <h1 className="mb-3 text-lg md:text-2xl font-semibold tracking-tight">Danh sách món</h1>
          <ProductGrid products={products} />
        </article>

        <aside className="hero-soft p-4 md:p-6 lg:h-[calc(100vh-140px)]">
          <h2 className="mb-3 text-base md:text-xl font-semibold">Giỏ hàng</h2>
          <CartPanel />
        </aside>
      </section>
    </main>
  )
}
