import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  sub?: string
  trend?: number
  trendLabel?: string
  icon?: string
  color?: 'green' | 'blue' | 'amber' | 'red'
}

export function StatsCard({ title, value, sub, trend, trendLabel, icon, color = 'green' }: StatsCardProps) {
  const colors = {
    green: 'bg-sw-50 border-sw-100',
    blue: 'bg-blue-50 border-blue-100',
    amber: 'bg-amber-50 border-amber-100',
    red: 'bg-red-50 border-red-100',
  }
  return (
    <div className={cn('rounded-xl border p-4', colors[color])}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-0.5">{value}</div>
      {sub && <div className="text-xs text-gray-500">{sub}</div>}
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs mt-1 font-medium', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}% {trendLabel}
        </div>
      )}
    </div>
  )
}
