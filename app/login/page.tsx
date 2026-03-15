'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'

const TRUST_POINTS = [
  'Direct factory pricing — no middlemen',
  'LC · PDC · TT · Card · Tabby accepted',
  'TDS & compliance certs on every order',
  'Next-day delivery across UAE',
]

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    router.push('/portal/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sw-800 via-sw-700 to-sw-600 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl flex gap-0 rounded-3xl overflow-hidden shadow-2xl">

        {/* ── Left panel — branding ── */}
        <div className="hidden md:flex flex-col justify-between w-5/12 bg-sw-900 p-10 text-white">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-sw-500 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md">
                SW
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">steelwood.ae</div>
                <div className="text-sw-300 text-xs">B2B Industrial Portal</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold leading-tight mb-2">
              UAE&apos;s #1 B2B<br />Chipboard Supplier
            </h2>
            <p className="text-sw-300 text-sm mb-8 leading-relaxed">
              Factory-direct pricing from JAFZA/NIP Dubai. Order online, get TDS, pay by LC or PDC.
            </p>

            <div className="space-y-3">
              {TRUST_POINTS.map((pt) => (
                <div key={pt} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sw-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-sw-200">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom cta */}
          <div className="mt-10 p-4 bg-sw-700/50 rounded-2xl border border-sw-600">
            <div className="text-xs text-sw-300 mb-1 font-medium">New to Steel Wood?</div>
            <div className="text-sm text-white font-semibold">Register your trade account in 2 minutes.</div>
            <button
              onClick={() => setTab('register')}
              className="mt-3 text-xs text-sw-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              Create account <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div className="flex-1 bg-white flex flex-col justify-center p-8 md:p-10">

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  tab === t
                    ? 'bg-white text-sw-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">Welcome back</h1>
                <p className="text-sm text-gray-500 mt-1">Sign in to your trade account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@company.ae"
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sw-500 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Password
                    </label>
                    <Link href="#" className="text-xs text-sw-500 hover:underline font-medium">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sw-500 transition-colors pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sw-500 hover:bg-sw-400 active:bg-sw-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-5">
                New to Steel Wood?{' '}
                <button onClick={() => setTab('register')} className="text-sw-500 font-bold hover:underline">
                  Register trade account
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">Create account</h1>
                <p className="text-sm text-gray-500 mt-1">Register your company for B2B pricing</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push('/checkout/company') }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">First Name</label>
                    <input type="text" placeholder="Ahmed" required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sw-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Last Name</label>
                    <input type="text" placeholder="Al Mansouri" required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sw-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Company Name</label>
                  <input type="text" placeholder="Al Mansouri Joinery LLC" required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sw-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Work Email</label>
                  <input type="email" placeholder="ahmed@company.ae" required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sw-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Mobile (+971)</label>
                  <input type="tel" placeholder="+971 50 XXX XXXX" required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sw-500 transition-colors" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-sw-500 hover:bg-sw-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-base flex items-center justify-center gap-2"
                >
                  Create Trade Account <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                By registering you agree to our{' '}
                <Link href="#" className="text-sw-500 hover:underline">Terms</Link> and{' '}
                <Link href="#" className="text-sw-500 hover:underline">Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
