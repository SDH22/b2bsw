'use client'
import Link from 'next/link'
import { User } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="bg-sw-800 text-white sticky top-0 z-50 shadow-lg" style={{ height: '64px' }}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 bg-sw-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md ring-2 ring-sw-400/40 group-hover:bg-sw-400 transition-colors">
            SW
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-bold text-[15px] tracking-tight">steelwood.ae</div>
            <div className="text-[11px] text-sw-300 font-medium tracking-wide">B2B Industrial Materials</div>
          </div>
        </Link>

        {/* Centred tagline */}
        <div className="hidden md:flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {/* Spinning leaf / recycling symbol */}
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400 flex-shrink-0"
              style={{ animation: 'spin-slow 4s linear infinite' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Recycling / leaf loop symbol */}
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
              <path d="M12 6c-1.5 2-2 4-1 6s3 3 5 2" />
              <path d="M12 6c1.5 2 2 4 1 6s-3 3-5 2" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-white font-bold text-[15px] tracking-tight whitespace-nowrap">
              Your 24/7 Store for Sustainable Wood
            </span>
            <svg
              className="w-5 h-5 text-green-400 flex-shrink-0"
              style={{ animation: 'spin-slow 4s linear infinite reverse' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
              <path d="M12 6c-1.5 2-2 4-1 6s3 3 5 2" />
              <path d="M12 6c1.5 2 2 4 1 6s-3 3-5 2" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-300 font-medium tracking-widest uppercase">
              E1 Certified · JAFZA Dubai · Factory Direct
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>

        {/* Login / Register */}
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-sw-800 hover:bg-sw-50 transition-all font-bold text-sm shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">LOGIN / REGISTER</span>
          <span className="sm:hidden">Login</span>
        </Link>

      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </nav>
  )
}
