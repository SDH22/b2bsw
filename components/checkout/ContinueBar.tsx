'use client'
import { ArrowRight } from 'lucide-react'
import { formatAED } from '@/lib/utils'

interface ContinueBarProps {
  label: string
  total: number
  qty: number
  onContinue: () => void
  disabled?: boolean
}

export function ContinueBar({ label, total, qty, onContinue, disabled }: ContinueBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-sw-800 text-white shadow-2xl z-50 border-t border-sw-700">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-sw-200 uppercase tracking-wider">Steel Wood Industries FZCO · JAFZA</div>
          <div className="font-semibold text-sm mt-0.5">{label}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xl font-bold">{formatAED(total)}</div>
            <div className="text-xs text-sw-200">{qty} sheets · incl. VAT</div>
          </div>
          <button
            onClick={onContinue}
            disabled={disabled}
            className="flex items-center gap-2 bg-sw-500 hover:bg-sw-400 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CONTINUE <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
