import React, { useState } from 'react'
import AgentThinking from '../components/AgentThinking.jsx'
import ShinyButton from '../components/ShinyButton.jsx'
import PostPreview from '../components/PostPreview.jsx'

import { pairImagesWithDrafts } from '../api/api.js'
export default function CreateContent(){
  const profile = JSON.parse(localStorage.getItem('brand_profile') || '{}')
  const [batch, setBatch] = useState([])
  const [loading, setLoading] = useState(false)
  const generate = async () => {
    setLoading(true)
    // Use images if available, but don't require them
    const images = profile?.images || []
    const out = await pairImagesWithDrafts(images)
    setBatch(out)
    setLoading(false)
  }
  const regenerate = async () => generate()
  return (
    <div className="container py-12 space-y-6">
      <AgentThinking show={loading} />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Generate Content Concepts</h2>
        <div className="flex gap-2">
          <ShinyButton onClick={generate}>Generate</ShinyButton>
          <button className="btn btn-outline btn-sheen btn-glow parallax" onClick={regenerate}>Regenerate</button>
        </div>
      </div>
      {batch.length === 0 ? (
        <div className="card p-6">Click "Generate" to create multiple AI content concepts personalized to your brand.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {batch.map(item => (<PostPreview key={item.id} data={item} />))}
        </div>
      )}
    </div>
  )
}
