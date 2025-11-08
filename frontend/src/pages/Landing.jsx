import React from 'react'
import { Link } from 'react-router-dom'
import ShinyButton from '../components/ShinyButton'

export default function Landing(){
  return (
    <div className="container py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">An AI teammate that learns your brand — and helps you ship content that performs.</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Understand your voice, spot what’s working in your niche, and generate drafts you can post today.
          </p>
          <div className="flex gap-3">
            <Link to="/onboarding"><ShinyButton>Start — define your brand</ShinyButton></Link>
            <Link to="/dashboard" className="btn btn-outline btn-sheen btn-glow parallax">View dashboard</Link>
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
