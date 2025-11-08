import React, { useEffect, useState } from 'react'
import { generateInsights } from '../api/mockAgent'
import ShinyButton from '../components/ShinyButton'
import AITyping from '../components/AITyping'

export default function Dashboard(){
  const fp = JSON.parse(localStorage.getItem('brand_fingerprint') || '{}')
  const ideas = JSON.parse(localStorage.getItem('generated_ideas') || '[]')
  const posts = JSON.parse(localStorage.getItem('similar_posts') || '[]')
  const [insights, setInsights] = useState(null)
  const [thinking, setThinking] = useState(true)

  useEffect(()=>{
    (async ()=>{
      const r = await generateInsights({ posts })
      setTimeout(()=>{
        if (r.ok) setInsights(r)
        setThinking(false)
      }, 1200)
    })()
  },[])

  return (
    <div className="container py-12 space-y-8">
      <header className="card p-6">
        <div className="text-xs text-slate-500">AI Briefing</div>
        <h2 className="text-2xl font-semibold mt-1">{fp.name || 'Your brand'}</h2>
        <p className="text-sm text-slate-500">{fp.industry || 'Your industry'} • Voice: <span className="font-medium">{fp.voice || '—'}</span></p>
      </header>

      {thinking && <AITyping label="Looking at what’s working this week…" />}

      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-6">
          <h3 className="font-semibold mb-2">What’s working this week</h3>
          {!insights ? (
            <div className="space-y-2">
              <div className="h-4 skeleton w-4/5"></div>
              <div className="h-4 skeleton w-2/3"></div>
              <div className="h-4 skeleton w-3/5"></div>
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed">{insights.summary}</p>
              <ul className="mt-4 list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {insights.bullets.map((b,i)=>(<li key={i}>{b}</li>))}
              </ul>
            </>
          )}
        </div>

        <aside className="card p-6">
          <h3 className="font-semibold mb-2">Recommendations</h3>
          {!insights ? (
            <div className="space-y-2">
              <div className="h-4 skeleton w-5/6"></div>
              <div className="h-4 skeleton w-4/6"></div>
              <div className="h-4 skeleton w-3/6"></div>
            </div>
          ) : (
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              {insights.recommendations.map((r,i)=>(<li key={i}>{r}</li>))}
            </ol>
          )}
          <div className="mt-4 flex gap-2">
            <ShinyButton onClick={()=>location.assign('/create')}>Generate next post</ShinyButton>
            <button className="btn btn-outline btn-sheen btn-glow parallax" onClick={()=>location.assign('/discover')}>Explore more posts</button>
          </div>
        </aside>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-3">Recent AI drafts</h3>
          {ideas.length ? (
            <ul className="text-sm space-y-2">
              {ideas.map(i => (<li key={i.id} className="flex items-start gap-3">
                <div className="h-10 w-14 skeleton rounded"></div>
                <div>
                  <div className="font-medium">{i.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{i.caption}</div>
                </div>
              </li>))}
            </ul>
          ) : <div className="text-sm text-slate-500">No drafts yet.</div>}
        </div>

        <div className="md:col-span-2 card p-6">
          <h3 className="font-semibold mb-3">Viral patterns spotted</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {posts.length ? posts.map(p => (
              <div key={p.id} className="border rounded p-3">
                <div className="h-20 skeleton mb-2"></div>
                <div className="text-sm font-medium">{p.brand}: {p.title}</div>
                <div className="text-xs text-slate-500">{p.views.toLocaleString()} views • {p.length}</div>
                <div className="text-xs mt-1">Hook: {p.hook}</div>
              </div>
            )) : (
              <>
                <div className="h-28 skeleton"></div>
                <div className="h-28 skeleton"></div>
                <div className="h-28 skeleton"></div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
