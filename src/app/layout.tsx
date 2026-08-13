import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VERO POS V1',
  description: 'VERO POS V1 - First runnable UI shell for coffee POS flow'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
