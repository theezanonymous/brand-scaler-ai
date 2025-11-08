import React from 'react'

export default function Dashboard(){
  const fp = JSON.parse(localStorage.getItem('brand_fingerprint') || '{}')
  return (
    <div className="container py-12 space-y-6">
      <h2 className="text-2xl font-semibold">5) Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="kpi"><div className="text-xs text-slate-500">Brand</div><div className="text-xl font-semibold mt-1">{fp.name || '—'}</div></div>
        <div className="kpi"><div className="text-xs text-slate-500">Industry</div><div className="text-xl font-semibold mt-1">{fp.industry || '—'}</div></div>
        <div className="kpi"><div className="text-xs text-slate-500">Voice</div><div className="text-xl font-semibold mt-1">{fp.voice || '—'}</div></div>
      </div>
      <div className="card p-6">
        <div className="text-sm text-slate-500 mb-2">Next actions</div>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Connect real social accounts (future OAuth).</li>
          <li>Replace mocks with API calls in <code>src/api/mockAgent.js</code>.</li>
          <li>Automate posting & performance tracking (post-MVP).</li>
        </ol>
      </div>
    </div>
  )
}
