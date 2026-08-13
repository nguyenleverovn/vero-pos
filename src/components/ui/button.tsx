import { type ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const base = 'inline-flex items-center justify-center rounded-md font-semibold transition-colors disabled:opacity-60'

const variants = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800',
  secondary: 'bg-white text-primary-800 border border-primary-700 hover:bg-primary-50',
  danger: 'bg-red-500 text-white hover:bg-red-600'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-5 py-3 text-base'
}

export function PrimaryButton({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const classNames = [base, variants[variant], sizes[size], className].filter(Boolean).join(' ')

  return <button {...props} className={classNames} />
}
