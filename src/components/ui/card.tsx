import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`rounded-md border border-border bg-white p-4 shadow-card ${className}`.trim()}>
      {children}
    </section>
  )
}
