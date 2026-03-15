'use client'
import { useState } from 'react'
import { Download, ExternalLink, Search, FileText, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const TDS_DOCS = [
  {
    id: '1', grade: 'MR', thickness: 18, ref: 'SW-TDS-MR-18', revision: 3,
    name: 'MR Chipboard 18mm — Moisture Resistant',
    issueDate: '2025-01-15', certifications: ['ISO 9001', 'EN 312 P3', 'E1', 'ESMA'],
    applications: ['Kitchen carcass', 'Bathroom vanities', 'Wet area joinery'],
    specs: { density: '680 kg/m³', formaldehyde: 'E1', fireClass: 'D-s2,d0', ib: '0.45 N/mm²', mor: '14 N/mm²' },
  },
  {
    id: '2', grade: 'FR', thickness: 18, ref: 'SW-TDS-FR-18', revision: 2,
    name: 'FR Chipboard 18mm — Fire Retardant',
    issueDate: '2025-02-01', certifications: ['ISO 9001', 'EN 13501-1', 'DCD', 'E1', 'ESMA'],
    applications: ['Hotel corridors', 'Civil Defence compliance', 'LEED projects'],
    specs: { density: '720 kg/m³', formaldehyde: 'E1', fireClass: 'B-s1,d0', ib: '0.50 N/mm²', mor: '16 N/mm²' },
  },
  {
    id: '3', grade: 'NFR', thickness: 12, ref: 'SW-TDS-NFR-12', revision: 4,
    name: 'NFR Chipboard 12mm — Standard Grade',
    issueDate: '2025-01-01', certifications: ['ISO 9001', 'EN 312 P2', 'E1'],
    applications: ['General joinery', 'Furniture carcass', 'Exhibition stands'],
    specs: { density: '640 kg/m³', formaldehyde: 'E1', fireClass: 'D-s2,d0', ib: '0.35 N/mm²', mor: '11 N/mm²' },
  },
  {
    id: '4', grade: 'AC', thickness: 18, ref: 'SW-TDS-AC-18', revision: 1,
    name: 'Acoustic Chipboard 18mm — Sound Absorbing',
    issueDate: '2025-03-01', certifications: ['ISO 9001', 'ISO 14001', 'E1'],
    applications: ['Recording studios', 'Cinema halls', 'Conference rooms'],
    specs: { density: '600 kg/m³', formaldehyde: 'E1', fireClass: 'D-s2,d0', ib: '0.30 N/mm²', mor: '10 N/mm²' },
  },
  {
    id: '5', grade: 'MR', thickness: 12, ref: 'SW-TDS-MR-12', revision: 2,
    name: 'MR Chipboard 12mm — Moisture Resistant',
    issueDate: '2025-01-15', certifications: ['ISO 9001', 'EN 312 P3', 'E1'],
    applications: ['Thin panel joinery', 'Drawer bases', 'Cabinet backs'],
    specs: { density: '670 kg/m³', formaldehyde: 'E1', fireClass: 'D-s2,d0', ib: '0.42 N/mm²', mor: '13 N/mm²' },
  },
  {
    id: '6', grade: 'FR', thickness: 25, ref: 'SW-TDS-FR-25', revision: 1,
    name: 'FR Chipboard 25mm — Fire Retardant',
    issueDate: '2025-03-01', certifications: ['ISO 9001', 'EN 13501-1', 'DCD', 'E1'],
    applications: ['Heavy-duty fire doors', 'High-rise partitions', 'Civil Defence spec'],
    specs: { density: '730 kg/m³', formaldehyde: 'E1', fireClass: 'B-s1,d0', ib: '0.52 N/mm²', mor: '17 N/mm²' },
  },
]

const GRADE_COLORS: Record<string, string> = {
  MR: 'bg-blue-100 text-blue-800 border-blue-200',
  FR: 'bg-red-100 text-red-800 border-red-200',
  NFR: 'bg-gray-100 text-gray-700 border-gray-200',
  AC: 'bg-purple-100 text-purple-800 border-purple-200',
}

const CERT_COLORS: Record<string, string> = {
  'ISO 9001': 'bg-green-100 text-green-700',
  'ISO 14001': 'bg-emerald-100 text-emerald-700',
  'EN 312 P2': 'bg-blue-100 text-blue-700',
  'EN 312 P3': 'bg-blue-100 text-blue-700',
  'EN 13501-1': 'bg-orange-100 text-orange-700',
  'DCD': 'bg-amber-100 text-amber-700',
  'ESMA': 'bg-sky-100 text-sky-700',
  'E1': 'bg-teal-100 text-teal-700',
}

export default function TDSLibraryPage() {
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState<string>('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = TDS_DOCS.filter((doc) => {
    const matchGrade = gradeFilter === 'ALL' || doc.grade === gradeFilter
    const matchSearch = !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.ref.toLowerCase().includes(search.toLowerCase()) ||
      doc.certifications.some(c => c.toLowerCase().includes(search.toLowerCase()))
    return matchGrade && matchSearch
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-sw-800 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-7 h-7 text-sw-300" />
            <h1 className="text-3xl font-bold">TDS Document Library</h1>
          </div>
          <p className="text-sw-200 text-sm">
            Full Technical Data Sheets for all Steel Wood Industries chipboard grades. ISO 9001 certified · EN 312 · DCD approved.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, reference or certification..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sw-500 bg-white"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'NFR', 'MR', 'FR', 'AC'].map((g) => (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-semibold border transition-all',
                  gradeFilter === g
                    ? 'bg-sw-500 text-white border-sw-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-sw-300'
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filtered.length} document{filtered.length !== 1 ? 's' : ''} found</p>

        {/* TDS Cards */}
        <div className="space-y-3">
          {filtered.map((doc) => {
            const expanded = expandedId === doc.id
            return (
              <div key={doc.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Main row */}
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 mt-0.5', GRADE_COLORS[doc.grade])}>
                      {doc.grade}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 mb-0.5">{doc.name}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="font-mono font-medium text-sw-600">{doc.ref}</span>
                        <span>Rev. {doc.revision}</span>
                        <span>Issued {doc.issueDate}</span>
                        <span>{doc.thickness}mm · 2440×1220mm</span>
                      </div>
                      {/* Certification chips */}
                      <div className="flex flex-wrap gap-1">
                        {doc.certifications.map((cert) => (
                          <span key={cert} className={cn('text-xs px-2 py-0.5 rounded-full font-medium', CERT_COLORS[cert] || 'bg-gray-100 text-gray-600')}>
                            ✓ {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 bg-sw-500 hover:bg-sw-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                    <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Request Signed
                    </button>
                    <button
                      onClick={() => setExpandedId(expanded ? null : doc.id)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded specs */}
                {expanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      {Object.entries(doc.specs).map(([key, val]) => (
                        <div key={key} className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                            {key === 'ib' ? 'Internal Bond' : key === 'mor' ? 'MOR' : key === 'fireClass' ? 'Fire Class' : key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                          <div className="font-bold text-gray-800 text-sm">{val}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Typical Applications</div>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.applications.map((app) => (
                          <span key={app} className="text-xs bg-sw-50 text-sw-700 border border-sw-100 px-2.5 py-1 rounded-full font-medium">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 border-t border-gray-100 pt-2">
                      This TDS is for guidance only. Actual properties may vary by batch. Contact Steel Wood Industries for project-specific specifications.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-8 bg-sw-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg mb-1">Need a Signed TDS on Official Letterhead?</div>
            <div className="text-sw-200 text-sm">Required for Civil Defence, Estidama, and LEED submissions — AED 50 per document.</div>
          </div>
          <button className="bg-sw-500 hover:bg-sw-400 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Request Signed TDS
          </button>
        </div>
      </div>
    </div>
  )
}
