import React, { useEffect, useState } from 'react'
import { createPosts } from '../api/mockAgent'

export default function CreateContent(){
  const [ideas, setIdeas] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async ()=>{
      const fingerprint = JSON.parse(localStorage.getItem('brand_fingerprint') || '{}')
      const r = await createPosts({ fingerprint })
      if (r.ok) setIdeas(r.ideas)
      setLoading(false)
    })()
  },[])

  const regenerate = async () => {
    setLoading(true)
    const fingerprint = JSON.parse(localStorage.getItem('brand_fingerprint') || '{}')
    const r = await createPosts({ fingerprint })
    if (r.ok) setIdeas(r.ideas)
    setLoading(false)
  }

  return (
    <div className="container py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">4) AI content drafts to post</h2>
        <button className="btn btn-outline" onClick={regenerate}>{loading? 'Thinking…' : 'Generate new ideas'}</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {loading ? Array.from({length:3}).map((_,i)=>(<div key={i} className="h-48 skeleton" />)) : ideas?.map(idea => (
          <div key={idea.id} className="card p-4">
            <div className="h-28 skeleton mb-3"></div>
            <div className="font-medium">{idea.title}</div>
            <div className="text-xs text-slate-500 mt-1">Storyboard:</div>
            <ul className="text-sm list-disc pl-5 mt-1 space-y-1">
              {idea.storyboard.map((s,i)=>(<li key={i}>{s}</li>))}
            </ul>
            <div className="text-xs text-slate-500 mt-2">Caption:</div>
            <div className="text-sm">{idea.caption}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <a href="/dashboard" className="btn-primary">Go to dashboard</a>
      </div>
    </div>
  )
}
