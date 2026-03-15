export function Footer() {
  return (
    <footer className="bg-sw-900 border-t border-sw-800 mt-16">

      {/* ── We Accept ───────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sw-400 text-xs font-semibold uppercase tracking-widest text-center mb-5">
          We Accept
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">

          {/* Card networks */}
          <div className="flex items-center gap-3">
            {/* Visa */}
            <div className="bg-white rounded-lg px-4 py-2.5 flex items-center justify-center shadow-sm h-11 w-20">
              <svg viewBox="0 0 780 500" className="h-6 w-auto" aria-label="Visa">
                <path fill="#1A1F71" d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7h-53.4zM543.6 158c-10.6-3.9-27.2-8.1-48-8.1-52.9 0-90.2 26.6-90.5 64.7-.3 28.2 26.6 43.9 46.9 53.3 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-32 19.2-21.4 0-32.7-3-50.2-10.4l-6.9-3.1-7.5 43.7c12.5 5.4 35.5 10.1 59.4 10.3 56.1 0 92.5-26.3 92.9-67-.2-22.3-14-39.3-44.8-53.3-18.7-9.1-30.1-15.1-30-24.3 0-8.1 9.7-16.8 30.6-16.8 17.4-.3 30.1 3.5 39.9 7.5l4.8 2.2 7.2-42.3zM661.3 152.6H618c-13.3 0-23.3 3.6-29.1 16.7l-82.6 186.3h58.4l11.6-30.4h71.3l6.7 30.4H703l-41.7-203zm-68.6 129.5c4.6-11.7 22.2-56.8 22.2-56.8s4.6-11.7 7.4-19.3l3.8 17.4 12.9 58.7H592.7zM241.4 152.6l-52.4 133.6-5.6-27.1c-9.7-31.1-40-64.9-73.9-81.8l47.9 170.7 56.6-.1 84.2-195.4-56.8.1z"/>
                <path fill="#F6AC1D" d="M163.4 152.7H76.7l-.7 4.1c67.5 16.3 112.2 55.7 130.8 103l-18.9-90.5c-3.3-12.7-12.9-16.3-24.5-16.6z"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="bg-white rounded-lg px-4 py-2.5 flex items-center justify-center shadow-sm h-11 w-20">
              <svg viewBox="0 0 131.39 86.9" className="h-6 w-auto" aria-label="Mastercard">
                <rect x="48.19" width="35" height="86.9" fill="#ff5f00"/>
                <path d="M51.94 43.45a55.17 55.17 0 0 1 13.25-36.45 55.22 55.22 0 1 0 0 72.9 55.17 55.17 0 0 1-13.25-36.45z" fill="#eb001b"/>
                <path d="M162.39 43.45a55.21 55.21 0 0 1-89.2 43.45 55.27 55.27 0 0 0 0-86.9 55.21 55.21 0 0 1 89.2 43.45z" fill="#f79e1b" transform="translate(-31)"/>
              </svg>
            </div>

            {/* Amex */}
            <div className="bg-[#2557D6] rounded-lg px-4 py-2.5 flex items-center justify-center shadow-sm h-11 w-20">
              <svg viewBox="0 0 750 471" className="h-5 w-auto" aria-label="American Express">
                <path fill="#fff" d="M0 0h750v471H0z"/>
                <path fill="#2557D6" d="M0 0h750v471H0z"/>
                <path fill="#fff" d="M166 315l-14-33h-52l-14 33H46l68-159h48l69 159h-65zm-40-89l-15 36h30l-15-36zM476 315l-47-72-47 72h-62l75-80-70-79h63l44 67 45-67h61l-70 79 75 80h-67zM580 315v-159h135l17 37-17 37h-70v85h-65z"/>
              </svg>
            </div>
          </div>

          <div className="w-px h-8 bg-sw-700 hidden sm:block" />

          {/* B2B payment methods */}
          <div className="flex items-center gap-2">
            <div className="bg-sw-700 rounded-lg px-3.5 py-2.5 h-11 flex items-center gap-2 text-white text-xs font-bold">
              <span className="text-base">📄</span> PDC
            </div>
            <div className="bg-sw-700 rounded-lg px-3.5 py-2.5 h-11 flex items-center gap-2 text-white text-xs font-bold">
              <span className="text-base">🏦</span> LC
            </div>
            <div className="bg-sw-700 rounded-lg px-3.5 py-2.5 h-11 flex items-center gap-2 text-white text-xs font-bold">
              <span className="text-base">⚡</span> TT
            </div>
          </div>

          <div className="w-px h-8 bg-sw-700 hidden sm:block" />

          {/* BNPL */}
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg px-4 py-2.5 h-11 flex items-center shadow-sm">
              <span className="text-pink-600 font-black text-sm tracking-tight">tabby</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2.5 h-11 flex items-center shadow-sm">
              <span className="text-green-700 font-black text-sm tracking-tight">tamara</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright ───────────────────────────────────────────── */}
      <div className="border-t border-sw-800 py-3">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-sw-400">
          <div className="flex items-center gap-3">
            <span>🔒 SSL Secured</span>
            <span>✅ ISO 9001</span>
            <span>🏭 JAFZA Registered</span>
            <span>🔥 DCD Approved</span>
          </div>
          <div>Copyright © 2026 Steel Wood Industries FZCO · JAFZA · NIP, Dubai UAE</div>
        </div>
      </div>

    </footer>
  )
}
