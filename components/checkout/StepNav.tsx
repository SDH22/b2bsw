import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'Order Details',   icon: '📦' },
  { id: 2, label: 'Service Tier',    icon: '⭐' },
  { id: 3, label: 'Review Order',    icon: '📋' },
  { id: 4, label: 'Company Details', icon: '🏢' },
  { id: 5, label: 'Add-on Services', icon: '➕' },
  { id: 6, label: 'Payment',         icon: '💳' },
]

interface StepNavProps {
  currentStep: number
}

export function StepNav({ currentStep }: StepNavProps) {
  const pct = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-sw-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between overflow-x-auto gap-1">
          {STEPS.map((step, i) => {
            const done   = step.id < currentStep
            const active = step.id === currentStep
            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all',
                    done   ? 'bg-sw-500 text-white shadow-sm' :
                    active ? 'bg-sw-500 text-white ring-2 ring-sw-200 shadow-sm' :
                             'bg-gray-100 text-gray-400'
                  )}>
                    {done ? <Check className="w-3.5 h-3.5" /> : step.id}
                  </div>
                  <span className={cn(
                    'text-xs whitespace-nowrap transition-colors',
                    active ? 'font-bold text-sw-700' :
                    done   ? 'font-medium text-sw-500' :
                             'text-gray-400'
                  )}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'w-6 md:w-10 h-0.5 mx-1.5 rounded-full transition-colors',
                    done ? 'bg-sw-400' : 'bg-gray-200'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
