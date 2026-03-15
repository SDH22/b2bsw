'use client'
import { useState } from 'react'
import { Save, Building2, CreditCard, Bell, Users } from 'lucide-react'

const SETTINGS = {
  siteName: 'Steel Wood Industries FZCO',
  contactEmail: 'orders@steelwood.ae',
  phone: '+971 4 XXX XXXX',
  whatsapp: '+971 5X XXX XXXX',
  address: 'Warehouse 12, National Industries Park, JAFZA, Dubai, UAE',
  trn: '100XXXXXXXXX000003',
  jafzaReg: 'JAFZA-XXXXXXXX',
  invoicePrefix: 'SW-INV-',
  orderPrefix: 'SW-ORD-',
  pdcBankName: 'Emirates NBD',
  pdcAccountNo: 'XXXXXXXXXX',
  pdcIBAN: 'AE07 0260 0010 1234 5678 901',
  lcSwift: 'EBILAEAD',
  lcIBAN: 'AE07 0260 0010 1234 5678 901',
  ttSwift: 'EBILAEAD',
}

const TABS = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'admins', label: 'Admin Users', icon: Users },
]

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState(SETTINGS)
  const [saved, setSaved] = useState(false)

  const set = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fieldClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Global portal configuration</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 bg-sw-500 hover:bg-sw-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Save className="w-4 h-4" />
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeTab === tab.key ? 'bg-sw-500 text-white border-sw-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">Company Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Company Name', 'siteName'], ['Contact Email', 'contactEmail'],
              ['Phone', 'phone'], ['WhatsApp', 'whatsapp'],
              ['TRN / VAT Number', 'trn'], ['JAFZA Registration', 'jafzaReg'],
              ['Invoice Prefix', 'invoicePrefix'], ['Order Prefix', 'orderPrefix'],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                <input value={(settings as Record<string, string>)[key]} onChange={e => set(key, e.target.value)} className={fieldClass} />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Company Address</label>
            <textarea value={settings.address} onChange={e => set('address', e.target.value)} rows={2} className={`${fieldClass} resize-none`} />
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="space-y-4">
          {[
            { title: 'PDC (Post-Dated Cheque)', fields: [['Bank Name', 'pdcBankName'], ['Account Number', 'pdcAccountNo'], ['IBAN', 'pdcIBAN']] },
            { title: 'Letter of Credit', fields: [['SWIFT Code', 'lcSwift'], ['IBAN', 'lcIBAN']] },
            { title: 'TT Bank Transfer', fields: [['SWIFT Code', 'ttSwift']] },
          ].map(section => (
            <div key={section.title} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">{section.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {section.fields.map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                    <input value={(settings as Record<string, string>)[key]} onChange={e => set(key, e.target.value)} className={fieldClass} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">WhatsApp &amp; Email Templates</h3>
          <div className="space-y-3">
            {[
              { label: 'Order Confirmed Template ID', placeholder: 'sw_order_confirmed' },
              { label: 'Order Dispatched Template ID', placeholder: 'sw_order_dispatched' },
              { label: 'Order Delivered Template ID', placeholder: 'sw_order_delivered' },
              { label: 'Price Lock Expiry Template ID', placeholder: 'sw_price_expiry' },
              { label: 'Email Sender Name', placeholder: 'Steel Wood Industries' },
              { label: 'Reply-To Email', placeholder: 'orders@steelwood.ae' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                <input placeholder={f.placeholder} className={fieldClass} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Admin Users</h3>
          <div className="space-y-2 mb-4">
            {[
              { name: 'Super Admin', email: 'admin@steelwood.ae', role: 'SUPER_ADMIN' },
              { name: 'Ops Manager', email: 'ops@steelwood.ae', role: 'ADMIN' },
            ].map(u => (
              <div key={u.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
                <span className="text-xs bg-sw-100 text-sw-700 font-semibold px-2 py-0.5 rounded-full">{u.role}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sw-500 text-sm font-medium hover:underline">
            <Users className="w-4 h-4" /> Add Admin User
          </button>
        </div>
      )}
    </div>
  )
}
