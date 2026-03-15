export function TrustBar() {
  return (
    <div className="bg-sw-800 text-white py-2.5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-6 text-xs flex-wrap">
          <span className="flex items-center gap-1.5">
            <span>🔒</span> Secure Payment · SSL 256-bit
          </span>
          <span className="text-sw-400">|</span>
          <span className="flex items-center gap-1.5">
            <span>🏭</span> Direct from Factory · JAFZA verified
          </span>
          <span className="text-sw-400">|</span>
          <span className="flex items-center gap-1.5">
            <span>📋</span> ISO 9001 Certified
          </span>
          <span className="text-sw-400">|</span>
          <span className="flex items-center gap-1.5">
            <span>🇦🇪</span> ESMA Approved
          </span>
        </div>
      </div>
    </div>
  )
}
