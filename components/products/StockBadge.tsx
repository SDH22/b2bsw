import { cn } from '@/lib/utils'

interface StockBadgeProps {
  available: number
  className?: string
}

export function StockBadge({ available, className }: StockBadgeProps) {
  let dot = 'bg-green-500'
  let label = `${available} in stock`
  let textColor = 'text-green-700'

  if (available <= 0) {
    dot = 'bg-red-500'
    label = 'Out of stock'
    textColor = 'text-red-600'
  } else if (available < 50) {
    dot = 'bg-amber-500'
    label = `Only ${available} left`
    textColor = 'text-amber-600'
  } else if (available > 500) {
    label = `${available}+ in stock`
  }

  return (
    <span className={cn('flex items-center gap-1.5 text-sm font-medium', textColor, className)}>
      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot)} />
      {label}
    </span>
  )
}
