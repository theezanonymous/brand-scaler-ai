import React from 'react'
export default function AgentThinking({ show=true, label='Analyzing and composing your next Reels…' }){
  if(!show) return null
  return (
    <div className="overlay">
      <div className="overlay-card text-center">
        <div className="text-sm text-slate-500 mb-2">{label}</div>
        <div className="flex items-center justify-center gap-1 text-accent-500 text-xl leading-none">
          <span className="animate-blink">•</span>
          <span className="animate-blink" style={{animationDelay:'.18s'}}>•</span>
          <span className="animate-blink" style={{animationDelay:'.36s'}}>•</span>
        </div>
      </div>
    </div>
  )
}
