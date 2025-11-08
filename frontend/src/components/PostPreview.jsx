import React, { useState } from 'react'
import { getVideoUrl } from '../api/api.js'

export default function PostPreview({ data, videoPath, num }){
  const brand = (JSON.parse(localStorage.getItem('brand_profile')||'{}').name) || 'yourbrand'
  const [videoError, setVideoError] = useState(false)
  const entryId = 0
  
  // Prioritize direct videoPath prop, then data.videoPath, then entry_id-based video
  const directVideoPath = videoPath || data.videoPath
  const hasDirectVideo = directVideoPath && !videoError
  const hasEntryVideo = entryId && typeof entryId === 'number' && !videoError && !directVideoPath
  const hasVideo = hasDirectVideo || hasEntryVideo

  const getVideoSrc = () => {
    if (hasDirectVideo) {
      return directVideoPath
    }
    if (hasEntryVideo) {
      return getVideoUrl(entryId)
    }
    return null
  }

  return (
    <div className="ig-frame hover:shadow-xl transition">
      <div className="ig-media">
        {hasVideo ? (
          <video 
            src={getVideoSrc()} 
            controls 
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoError(false)}
          />
        ) : (
          <img src={data.image} alt="mock reel" />
        )}
        <div className="ig-hook">{data.engagement_tips}</div>
        <div className="ig-play">▶ 12s</div>
      </div>
      <div className="ig-body">
        <div className="text-sm"><span className="font-semibold">{brand}</span> {num==1 ? "Funny Driving Adventures" : "Funny Cartoon Ad"}</div>
        <div className="ig-actions mt-2">❤️ {data.metrics?.likes?.toLocaleString?.() || data.metrics?.likes} · 💬 {data.metrics?.comments?.toLocaleString?.() || data.metrics?.comments} · Reels</div>
        <div className="ig-meta mt-1">AI-generated short-form video • personalized to your brand</div>
        {entryId && (
          <div className="text-xs text-slate-500 mt-1">Entry ID: {entryId}</div>
        )}
        <div className="ig-besttime">{data.bestTime}</div>
      </div>
    </div>
  )
}
