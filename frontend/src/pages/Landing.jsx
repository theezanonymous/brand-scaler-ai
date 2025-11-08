import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="container py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">A strategist that learns your brand — and creates content that performs.</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Brand-aware discovery, insight, and content generation for short-form platforms.
          </p>
          <div className="flex gap-3">
            <Link to="/onboarding" className="btn-primary">Start — define your brand</Link>
            <Link to="/dashboard" className="btn btn-outline">View dashboard</Link>
          </div>
        </div>
        <div className="card p-6">
          <div className="h-32 skeleton mb-3"></div>
          <div className="h-4 skeleton mb-2 w-2/3"></div>
          <div className="h-4 skeleton mb-2 w-1/2"></div>
          <div className="h-4 skeleton w-5/6"></div>
        </div>
      </div>
    </div>
  )
}
