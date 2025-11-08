import React, { useEffect, useState } from 'react'
import { generateInsights } from '../api/mockAgent'
import AITextReveal from '../components/AITextReveal'

export default function Insights(){
  const [out, setOut] = useState(null)
  useEffect(()=>{
    (async ()=>{
      const r = await generateInsights({ posts: [] })
      if (r.ok) setOut(r)
    })()
  },[])

  return (
    <div className="container py-12 space-y-8">
      <h2 className="text-2xl font-semibold">3) Why those posts worked</h2>

      {!out ? (
        <div className="h-28 skeleton" />
      ) : (
        <div className="card p-6">
          <AITextReveal text={out.summary} />
          <ul className="mt-4 list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {out.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <a href="/create" className="btn-primary">Generate content ideas</a>
      </div>
    </div>
  )
}
