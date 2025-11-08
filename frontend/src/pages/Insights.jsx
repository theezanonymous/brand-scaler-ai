import React, { useEffect, useState } from 'react'
import { insightsReport } from '../api/mockAgent.js'
import { Link } from 'react-router-dom'
import ShinyButton from '../components/ShinyButton.jsx'
export default function Insights(){
  const [r, setR] = useState(null)
  useEffect(()=>{ (async()=> setR(await insightsReport()))() },[])
  return (
    <div className="container py-12 space-y-6">
      <h2 className="text-2xl font-semibold">Insights — Patterns To Use</h2>
      {!r ? <div className="h-28 skeleton" /> : (<>
        <div className="card agent-surface p-6"><div className="bubble">{r.summary}</div></div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-4"><div className="font-semibold mb-2">Common hooks</div>
            <ul className="list-disc pl-5 text-sm">{r.commonHooks.map((x,i)=>(<li key={i}>{x}</li>))}</ul></div>
          <div className="card p-4"><div className="font-semibold mb-2">Emotional tones</div>
            <ul className="list-disc pl-5 text-sm">{r.tones.map((x,i)=>(<li key={i}>{x}</li>))}</ul></div>
          <div className="card p-4"><div className="font-semibold mb-2">CTAs seen</div>
            <ul className="list-disc pl-5 text-sm">{r.ctas.map((x,i)=>(<li key={i}>{x}</li>))}</ul></div>
        </div>
        <div className="flex justify-end"><Link to="/create"><ShinyButton>Generate Content</ShinyButton></Link></div>
      </>)}
    </div>
  )
}
