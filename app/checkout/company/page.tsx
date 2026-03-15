'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { StepNav } from '@/components/checkout/StepNav'
import { ContinueBar } from '@/components/checkout/ContinueBar'
import { cn } from '@/lib/utils'

const INDUSTRIES = [
  'Joinery', 'Fitout Contractor', 'Door Manufacturer', 'Distributor',
  'Hospitality', 'Construction', 'Retail', 'Other',
]

function CompanyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const qty       = Number(searchParams.get('qty')   || 100)
  const tier      = searchParams.get('tier')          || 'VALUE'
  const sku       = searchParams.get('sku')           || ''
  const grade     = searchParams.get('grade')         || 'MR'
  const thickness = searchParams.get('thickness')     || '18'
  const zone      = searchParams.get('zone')          || 'al-quoz'

  const [form, setForm] = useState({
    salutation: 'Mr', firstName: '', lastName: '', companyName: '',
    trnVat: '', tradeLicenceNo: '', licenceExpiry: '', industry: '',
    phone: '', whatsapp: '', email: '', address: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName) e.lastName = 'Required'
    if (!form.companyName) e.companyName = 'Required'
    if (!form.tradeLicenceNo) e.tradeLicenceNo = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.phone) e.phone = 'Required'
    if (!form.address) e.address = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validate()) {
      router.push(`/checkout/payment?sku=${sku}&grade=${grade}&thickness=${thickness}&zone=${zone}&tier=${tier}&qty=${qty}`)
    }
  }

  const fieldClass = (key: string) => cn(
    'w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500 transition-colors',
    errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200'
  )

  const BASE_PRICES: Record<string, number> = { NFR: 30, MR: 38, FR: 61, AC: 85 }
  const ZONE_COSTS:  Record<string, number> = { 'jebel-ali': 4, 'al-quoz': 6, 'sharjah': 9, 'abu-dhabi': 22, 'al-ain': 28 }
  const sub = (BASE_PRICES[grade] ?? 38) * qty + (tier !== 'LITE' ? (ZONE_COSTS[zone] ?? 6) * qty : 0)
  const total = Math.round((sub + sub * 0.05) * 100) / 100

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <StepNav currentStep={4} />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Warning banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important:</strong> Ensure company name matches your Trade Licence exactly. VAT number required for proper invoicing.
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">Company Details</h2>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Salutation</label>
              <select value={form.salutation} onChange={(e) => set('salutation', e.target.value)} className={fieldClass('salutation')}>
                {['Mr', 'Ms', 'Mrs', 'Dr', 'Eng'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">First Name *</label>
              <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="First name" className={fieldClass('firstName')} />
              {errors.firstName && <div className="text-xs text-red-500 mt-0.5">{errors.firstName}</div>}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Last Name *</label>
              <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Last name" className={fieldClass('lastName')} />
              {errors.lastName && <div className="text-xs text-red-500 mt-0.5">{errors.lastName}</div>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Company Name (as per Trade Licence) *</label>
              <input value={form.companyName} onChange={(e) => set('companyName', e.target.value)} placeholder="Exact company name" className={fieldClass('companyName')} />
              {errors.companyName && <div className="text-xs text-red-500 mt-0.5">{errors.companyName}</div>}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">TRN / VAT Number</label>
              <input value={form.trnVat} onChange={(e) => set('trnVat', e.target.value)} placeholder="100XXXXXXXXX000003" className={fieldClass('trnVat')} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Trade Licence No. *</label>
              <input value={form.tradeLicenceNo} onChange={(e) => set('tradeLicenceNo', e.target.value)} placeholder="TL-XXXXXXXX" className={fieldClass('tradeLicenceNo')} />
              {errors.tradeLicenceNo && <div className="text-xs text-red-500 mt-0.5">{errors.tradeLicenceNo}</div>}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Licence Expiry</label>
              <input type="date" value={form.licenceExpiry} onChange={(e) => set('licenceExpiry', e.target.value)} className={fieldClass('licenceExpiry')} />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Industry</label>
              <select value={form.industry} onChange={(e) => set('industry', e.target.value)} className={fieldClass('industry')}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-1">Contact Information</h2>
          <p className="text-xs text-gray-500 mb-4">Order confirmation, invoice, and TDS documents will be sent to details below</p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Mobile / Phone (+971) *</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+971 5X XXX XXXX" className={fieldClass('phone')} />
              {errors.phone && <div className="text-xs text-red-500 mt-0.5">{errors.phone}</div>}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">WhatsApp Number</label>
              <input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+971 5X XXX XXXX" className={fieldClass('whatsapp')} />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-500 font-medium mb-1 block">Email Address *</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="procurement@company.ae" className={fieldClass('email')} />
            {errors.email && <div className="text-xs text-red-500 mt-0.5">{errors.email}</div>}
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Delivery Site Address *</label>
            <textarea value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Building, Street, Area, Emirate" rows={2} className={cn(fieldClass('address'), 'resize-none')} />
            {errors.address && <div className="text-xs text-red-500 mt-0.5">{errors.address}</div>}
          </div>
        </div>
      </div>

      <ContinueBar
        label="Company Details"
        total={total}
        qty={qty}
        onContinue={handleContinue}
      />
    </div>
  )
}

export default function CompanyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <CompanyPageContent />
    </Suspense>
  )
}
