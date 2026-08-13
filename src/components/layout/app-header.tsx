export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted">VERO POS</p>
          <h1 className="font-heading mt-1 text-2xl text-foreground">Chạm là chạy</h1>
        </div>
      </div>
    </header>
  )
}
