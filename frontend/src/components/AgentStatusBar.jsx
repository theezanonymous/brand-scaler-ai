import React from 'react'
export default function AgentStatusBar(){
  return (
    <div className="sticky top-14 z-10 border-b border-slate-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 backdrop-blur">
      <div className="container flex items-center gap-3 py-2">
        <div className="agent-orb" />
        <div className="text-sm">Agent Active — video generation model tuned to your brand.</div>
      </div>
    </div>
  )
}
