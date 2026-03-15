'use client'
import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, Clock, AlertTriangle, FileText } from 'lucide-react'
import { StepNav } from '@/components/checkout/StepNav'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { TrustBar } from '@/components/layout/TrustBar'
import { cn, formatAED } from '@/lib/utils'

const PAYMENT_TABS = [
  { key: 'credit', label: 'Credit Card', icon: '💳', sub: 'Visa / MC / Amex' },
  { key: 'debit', label: 'Debit Card', icon: '🪪', sub: 'Visa / Mastercard' },
  { key: 'pdc', label: 'PDC', icon: '📄', sub: 'Post-Dated Cheque' },
  { key: 'lc', label: 'Letter of Credit', icon: '🏦', sub: 'Irrevocable LC' },
  { key: 'tabby', label: 'tabby', icon: '🟣', sub: 'Split 4 · 0% interest' },
  { key: 'tamara', label: 'tamara', icon: '🟢', sub: 'Pay in 3 · 0% interest' },
  { key: 'emi', label: 'Card EMI', icon: '📊', sub: '3–12 months' },
]

const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12']
const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i))
const BANKS = ['Emirates NBD', 'First Abu Dhabi Bank', 'Abu Dhabi Islamic Bank', 'Mashreq Bank', 'HSBC UAE', 'Standard Chartered', 'Other']

function CardForm({ onCardNumberChange }: { onCardNumberChange?: (v: string) => void }) {
  const [cardNum, setCardNum] = useState('')
  const [name, setName] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [cvv, setCvv] = useState('')

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Card Number</label>
        <div className="relative">
          <input
            type="text"
            value={cardNum}
            onChange={(e) => {
              const v = formatCard(e.target.value)
              setCardNum(v)
              onCardNumberChange?.(v)
            }}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sw-500 pr-16"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">VISA</span>
            <span className="text-xs bg-gray-700 text-white px-1.5 py-0.5 rounded font-bold">MC</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Name on Card</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="AS ON CARD"
          className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sw-500"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 mb-1 block">Expiry</label>
          <div className="flex gap-2">
            <select value={month} onChange={(e) => setMonth(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500">
              <option value="">MM</option>
              {MONTHS.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500">
              <option value="">YYYY</option>
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">CVV</label>
          <div className="relative">
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="•••"
              maxLength={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">3-digit on back</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PDCForm({ orderTotal }: { orderTotal: number }) {
  const [chequeNum, setChequeNum] = useState('')
  const [chequeDate, setChequeDate] = useState('')
  const [bank, setBank] = useState('')
  const [numCheques, setNumCheques] = useState(1)

  const instalment = Math.round((orderTotal / numCheques) * 100) / 100

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <strong>PDC payable to:</strong> Steel Wood Industries FZCO<br />
        <strong>Bank:</strong> Emirates NBD · A/C: XXXXXX-XXXX
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Cheque Number</label>
        <input type="text" value={chequeNum} onChange={(e) => setChequeNum(e.target.value)} placeholder="000001" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Cheque Date</label>
          <input type="date" value={chequeDate} onChange={(e) => setChequeDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Bank Name</label>
          <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500">
            <option value="">Select bank</option>
            {BANKS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Number of Cheques</label>
        <div className="flex gap-2">
          {[1, 2, 4].map((n) => (
            <button
              key={n}
              onClick={() => setNumCheques(n)}
              className={cn(
                'flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all',
                numCheques === n ? 'bg-sw-500 text-white border-sw-500' : 'border-gray-200 text-gray-700 hover:border-sw-300'
              )}
            >
              {n} cheque{n > 1 ? 's' : ''}
              <div className={cn('text-xs font-normal mt-0.5', numCheques === n ? 'text-sw-100' : 'text-gray-400')}>
                AED {instalment.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LCForm() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        LC accepted for orders above <strong>AED 20,000</strong> only. Must be irrevocable, issued by a UAE-licensed bank.
      </div>
      {[
        { label: 'Issuing Bank', placeholder: 'e.g. Emirates NBD' },
        { label: 'LC Reference Number', placeholder: 'LC-XXXX-XXXX' },
      ].map((f) => (
        <div key={f.label}>
          <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
          <input type="text" placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500" />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">LC Amount (AED)</label>
          <input type="number" placeholder="20000" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">LC Expiry Date</label>
          <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500" />
        </div>
      </div>
    </div>
  )
}

function TabbyForm({ total }: { total: number }) {
  const instalment = Math.round((total / 4) * 100) / 100
  const months = ['Today', '1 month', '2 months', '3 months']
  return (
    <div>
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-4">
        <div className="font-bold text-pink-800 mb-3 text-center">Split into 4 payments with tabby</div>
        <div className="grid grid-cols-4 gap-2">
          {months.map((m, i) => (
            <div key={m} className={cn('text-center p-2 rounded-lg border', i === 0 ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-pink-200')}>
              <div className="font-bold text-sm">AED {instalment.toLocaleString()}</div>
              <div className={cn('text-xs mt-0.5', i === 0 ? 'text-pink-100' : 'text-pink-600')}>{m}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-pink-700 text-center mt-3 font-medium">0% interest · No hidden fees · Instant approval</div>
      </div>
    </div>
  )
}

function TamaraForm({ total }: { total: number }) {
  const instalment = Math.round((total / 3) * 100) / 100
  const months = ['Today', '1 month', '2 months']
  return (
    <div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
        <div className="font-bold text-green-800 mb-3 text-center">Pay in 3 with tamara</div>
        <div className="grid grid-cols-3 gap-3">
          {months.map((m, i) => (
            <div key={m} className={cn('text-center p-3 rounded-lg border', i === 0 ? 'bg-green-600 text-white border-green-600' : 'bg-white border-green-200')}>
              <div className="font-bold">AED {instalment.toLocaleString()}</div>
              <div className={cn('text-xs mt-0.5', i === 0 ? 'text-green-100' : 'text-green-600')}>{m}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-green-700 text-center mt-3 font-medium">0% markup · Instant decision</div>
      </div>
    </div>
  )
}

function EMIForm({ total }: { total: number }) {
  const [tenure, setTenure] = useState(6)
  const TENURES = [3, 6, 12]
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">Select EMI Tenure</label>
      <div className="flex gap-3 mb-4">
        {TENURES.map((t) => {
          const monthly = Math.round((total / t) * 100) / 100
          return (
            <button
              key={t}
              onClick={() => setTenure(t)}
              className={cn(
                'flex-1 py-3 rounded-xl border text-sm font-semibold transition-all text-center',
                tenure === t ? 'bg-sw-500 text-white border-sw-500' : 'border-gray-200 hover:border-sw-300'
              )}
            >
              <div>{t} months</div>
              <div className={cn('text-xs font-normal mt-0.5', tenure === t ? 'text-sw-100' : 'text-gray-500')}>
                AED {monthly.toLocaleString()}/mo
              </div>
            </button>
          )
        })}
      </div>
      <CardForm />
    </div>
  )
}

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const qty = Number(searchParams.get('qty') || 100)
  const tier = searchParams.get('tier') || 'VALUE'
  const [activeTab, setActiveTab] = useState('credit')
  const [timeLeft, setTimeLeft] = useState(30 * 60)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const base = 38 * qty
  const delivery = tier !== 'LITE' ? 6 * qty : 0
  const sub = base + delivery
  const vat = Math.round(sub * 0.05 * 100) / 100
  const convenience = Math.round(sub * 0.011 * 100) / 100
  const total = ['credit', 'debit', 'emi'].includes(activeTab) ? sub + vat + convenience : sub + vat

  return (
    <div className="bg-gray-50 min-h-screen">
      <TrustBar />
      <StepNav currentStep={6} />

      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Order review compact row */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">MR</span>
              <span className="font-semibold">MR Chipboard 18mm → Jebel Ali</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600">Dispatch: Within 2 days</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600">{tier}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600">{qty} sheets</span>
              <button className="text-sw-500 text-xs hover:underline ml-auto">Review your order →</button>
            </div>
          </div>

          {/* Logged in row */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-sw-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800">Ahmed Al Rashidi</div>
              <div className="text-xs text-gray-500">ahmed@alrashidi.ae · Trade account verified · TRN: 100123456700003</div>
            </div>
            <button className="text-xs text-sw-500 hover:underline">Switch account</button>
          </div>

          {/* Buyer details row */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-sm">Al Rashidi Joinery LLC</div>
                <div className="text-xs text-gray-500">TL: DED-XXXXXXXX · VAT: 100123456700003</div>
                <div className="text-xs text-gray-500 mt-0.5">+971 55 XXX XXXX</div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  ✓ WhatsApp · ✓ AED 50 TDS
                </span>
              </div>
            </div>
          </div>

          {/* Session timer */}
          <div className={cn(
            'rounded-xl border px-4 py-3 flex items-center gap-2',
            timeLeft < 5 * 60 ? 'bg-red-50 border-red-200' : 'bg-sw-50 border-sw-200'
          )}>
            <Clock className={cn('w-4 h-4 flex-shrink-0', timeLeft < 5 * 60 ? 'text-red-500' : 'text-sw-500')} />
            <span className="text-sm text-gray-700">🕐 Price locked until Mar 21 · Session expires in:</span>
            <span className={cn(
              'font-bold font-mono text-lg',
              timeLeft < 5 * 60 ? 'text-red-600' : 'text-sw-700'
            )}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* ── Review & Policy Warning ────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sw-500" />
              <span className="font-semibold text-gray-800 text-sm">Review Before Payment</span>
            </div>
            {/* Order snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100 text-sm">
              {[
                ['Product', `${searchParams.get('grade') || 'MR'} Chipboard ${searchParams.get('thickness') || '18'}mm`],
                ['Quantity', `${qty} sheets`],
                ['Delivery Zone', searchParams.get('zone') ? ({'jebel-ali':'Jebel Ali','al-quoz':'Al Quoz','sharjah':'Sharjah','abu-dhabi':'Abu Dhabi','al-ain':'Al Ain'}[searchParams.get('zone')!] || searchParams.get('zone')) : 'Al Quoz'],
                ['Service Tier', tier],
              ].map(([label, value]) => (
                <div key={label} className="px-4 py-3">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</div>
                  <div className="font-bold text-gray-800 text-sm">{value}</div>
                </div>
              ))}
            </div>
            {/* Policy warning */}
            <div className="p-4 bg-red-50 border-t border-red-100 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-800 leading-relaxed space-y-1">
                <div className="font-black uppercase tracking-wide text-[11px] text-red-700 mb-1.5">
                  Please review carefully — once payment is processed:
                </div>
                <div>• <strong>Any changes or cancellation</strong> will incur a minimum <strong>15% deduction penalty</strong> on the order value.</div>
                <div>• <strong>No refund</strong> will be processed after delivery, provided the goods match the ordered specifications (grade, thickness, quantity).</div>
                <div>• Disputes must be raised within <strong>24 hours of delivery</strong> with photographic evidence of any discrepancy.</div>
              </div>
            </div>
          </div>

          {/* Payment tabs */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-4 pt-4">
              <h3 className="font-bold text-gray-800 mb-3">Make Payment</h3>
              <div className="flex gap-0 overflow-x-auto">
                {PAYMENT_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'flex flex-col items-center gap-1 px-4 py-2.5 border-b-2 text-center min-w-[80px] transition-all whitespace-nowrap',
                      activeTab === tab.key
                        ? 'border-sw-500 text-sw-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-xs font-semibold">{tab.label}</span>
                    <span className="text-xs text-gray-400">{tab.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              {(activeTab === 'credit' || activeTab === 'debit') && <CardForm />}
              {activeTab === 'pdc' && <PDCForm orderTotal={total} />}
              {activeTab === 'lc' && <LCForm />}
              {activeTab === 'tabby' && <TabbyForm total={total} />}
              {activeTab === 'tamara' && <TamaraForm total={total} />}
              {activeTab === 'emi' && <EMIForm total={total} />}

              {/* Total payable row */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Total payable amount</div>
                  <div className="text-3xl font-bold text-sw-800">{formatAED(total)}</div>
                  {['credit', 'debit', 'emi'].includes(activeTab) && (
                    <div className="text-xs text-gray-400 mt-0.5">Includes 1.1% card convenience fee</div>
                  )}
                </div>
                <button
                  onClick={() => router.push('/confirmation/SW-ORD-12345')}
                  className="flex items-center gap-2 bg-sw-800 hover:bg-sw-900 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
                >
                  CONFIRM ORDER ▶
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                By confirming, you agree to Steel Wood Industries FZCO Supply Terms &amp; Conditions, Privacy Policy, UAE VAT regulations, and force majeure clause. All prices are in AED inclusive of 5% VAT. Cancellation or changes post-payment incur a minimum 15% penalty. No refund after delivery matching specifications.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 hidden lg:block space-y-4">
          <OrderSummary
            baseAmount={base}
            deliveryAmount={delivery}
            addonsAmount={50}
            vatAmount={vat}
            discount={0}
            convenienceFee={['credit', 'debit', 'emi'].includes(activeTab) ? convenience : 0}
            total={total}
          />
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="font-semibold text-gray-800 mb-2 text-sm">Promo Code</div>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter code" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500" />
              <button className="bg-sw-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-sw-600">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <PaymentPageContent />
    </Suspense>
  )
}
