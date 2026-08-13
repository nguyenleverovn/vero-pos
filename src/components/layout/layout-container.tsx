import { type ReactNode } from 'react'

type LayoutContainerProps = {
  children: ReactNode
  className?: string
}

export function LayoutContainer({ children, className = '' }: LayoutContainerProps) {
  return <main className={`mx-auto w-full max-w-[1280px] px-4 md:px-6 ${className}`.trim()}>{children}</main>
}
