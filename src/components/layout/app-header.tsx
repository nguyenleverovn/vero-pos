export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm uppercase tracking-[0.14em] text-primary-800">VERO POS V1</p>
          <h1 className="text-xl font-semibold">Chạm là chạy</h1>
        </div>
        <div className="rounded-full bg-primary-700 px-4 py-2 text-sm text-white">Main Flow: Product → Cart → Checkout</div>
      </div>
    </header>
  )
}
