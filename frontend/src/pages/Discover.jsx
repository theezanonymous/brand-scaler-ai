import React, { useEffect, useState } from 'react'
import { findSimilar } from '../api/mockAgent'
import ShinyButton from '../components/ShinyButton'
import { Link } from 'react-router-dom'

export default function Discover(){
  const [brands, setBrands] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async ()=>{
      const r = await findSimilar({ industry: 'mock' })
      if (r.ok){ setBrands(r.brands); setPosts(r.posts); }
      setLoading(false)
    })()
  },[])

  return (
    <div className="container py-12 space-y-8">
      <h2 className="text-2xl font-semibold">2) Discover similar brands & viral posts</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {loading ? Array.from({length:3}).map((_,i)=>(<div key={i} className="h-28 skeleton" />)) : brands.map(b => (
          <div key={b.name} className="card p-4 animate-floaty">
            <div className="text-lg font-medium">{b.name}</div>
            <div className="text-sm text-slate-500">@{b.handle.replace('@','')}</div>
            <div className="text-sm mt-1">{b.followers.toLocaleString()} followers</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {loading ? Array.from({length:3}).map((_,i)=>(<div key={i} className="h-40 skeleton" />)) : posts.map(p => (
          <div key={p.id} className="card p-4">
            <div className="h-24 skeleton mb-3"></div>
            <div className="font-medium">{p.brand}: {p.title}</div>
            <div className="text-xs text-slate-500">{p.views.toLocaleString()} views • {p.length}</div>
            <div className="text-sm mt-1">Hook: {p.hook}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Link to="/insights"><ShinyButton>Continue to insights</ShinyButton></Link>
      </div>
    </div>
  )
}
