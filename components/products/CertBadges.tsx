import { cn } from '@/lib/utils'

const CERT_STYLES: Record<string, string> = {
  'ISO 9001': 'bg-green-100 text-green-800 border-green-200',
  'ISO 14001': 'bg-teal-100 text-teal-800 border-teal-200',
  'EN 312 P2': 'bg-blue-100 text-blue-800 border-blue-200',
  'EN 312 P3': 'bg-blue-100 text-blue-800 border-blue-200',
  'EN 13501-1': 'bg-red-100 text-red-800 border-red-200',
  'DCD': 'bg-amber-100 text-amber-800 border-amber-200',
  'ESMA': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'E1': 'bg-purple-100 text-purple-800 border-purple-200',
}

interface CertBadgesProps {
  certifications: string[]
  size?: 'sm' | 'md'
}

export function CertBadges({ certifications, size = 'sm' }: CertBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {certifications.map((cert) => (
        <span
          key={cert}
          className={cn(
            'border rounded px-1.5 py-0.5 font-semibold',
            size === 'sm' ? 'text-xs' : 'text-sm',
            CERT_STYLES[cert] || 'bg-gray-100 text-gray-700 border-gray-200'
          )}
        >
          {cert}
        </span>
      ))}
    </div>
  )
}
