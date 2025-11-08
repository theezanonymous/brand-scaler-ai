import React, { useEffect, useState } from 'react'
import { scoutDiscovery } from '../api/api.js'
import { Link } from 'react-router-dom'
import ShinyButton from '../components/ShinyButton.jsx'
export default function Discover(){
  const [data, setData] = useState(null)
  useEffect(()=>{ (async()=> setData(await scoutDiscovery()))() },[])
  return (
    <div className="container py-12 space-y-6">
      <h2 className="text-2xl font-semibold">Discovery — What’s Working Now</h2>
      {!data ? <div className="h-28 skeleton"/> : (<>
        <div className="grid md:grid-cols-3 gap-4">
          {data.brands.map(b => (
            <div key={b.name} className="card p-4">
              <div className="text-lg font-medium">{b.name}</div>
              <div className="text-sm text-slate-500">{b.handle}</div>
              <div className="text-sm mt-1">{b.followers.toLocaleString()} followers</div>
              <div className="text-xs mt-2 text-slate-500">Tags: {b.tags.join(', ')}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {data.reels.map(r => (
            <div key={r.id} className="card p-4">
              <div className="h-40 skeleton mb-3"></div>
              <div className="font-medium">{r.brand}</div>
              <div className="text-xs text-slate-500">{r.views.toLocaleString()} views • {r.length}</div>
              <div className="text-sm mt-1">Hook: {r.hook}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Link to="/insights"><ShinyButton>See Insights</ShinyButton></Link>
        </div>
      </>)}
    </div>
  )
}
