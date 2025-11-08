import React from 'react'

export default function PostPreview({ data }){
  const brand = (JSON.parse(localStorage.getItem('brand_profile')||'{}').name) || 'yourbrand'
  return (
    <div className="ig-frame hover:shadow-xl transition">
      <div className="ig-media">
        <img src={data.image} alt="mock reel" />
        <div className="ig-hook">{data.hook}</div>
        <div className="ig-play">▶ 12s</div>
      </div>
      <div className="ig-body">
        <div className="text-sm"><span className="font-semibold">{brand}</span> {data.caption}</div>
        <div className="ig-actions mt-2">❤️ {data.metrics?.likes?.toLocaleString?.() || data.metrics?.likes} · 💬 {data.metrics?.comments?.toLocaleString?.() || data.metrics?.comments} · Reels</div>
        <div className="ig-meta mt-1">AI-generated short-form video • personalized to your brand</div>
        <div className="ig-besttime">{data.bestTime}</div>
      </div>
    </div>
  )
}
