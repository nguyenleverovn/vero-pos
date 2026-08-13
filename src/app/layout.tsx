import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VERO POS V1',
  description: 'VERO POS V1 - App foundation for VERO POS design system'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
