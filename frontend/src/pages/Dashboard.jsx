import React, { useState } from 'react'
import ShinyButton from '../components/ShinyButton.jsx'
import { sendBusinessInfo } from '../api/api.js'

export default function Dashboard(){
  const [profile, setProfile] = useState(()=> JSON.parse(localStorage.getItem('brand_profile') || '{}'))
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(profile.description || '')
  const [saving, setSaving] = useState(false)
  const saveDesc = async () => {
    setSaving(true)
    try {
      const next = { ...profile, description: desc }
      setProfile(next)
      localStorage.setItem('brand_profile', JSON.stringify(next))
      // Send updated info to backend
      await sendBusinessInfo(next)
      setEditing(false)
    } catch (error) {
      console.error('Error saving business info:', error)
      alert('Failed to save to backend. Changes saved locally only.')
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="container py-12 space-y-6">
      <header className="card p-6">
        <div className="text-xs text-slate-500">Agent Briefing</div>
        <h2 className="text-2xl font-semibold mt-1">{profile.name || 'Your brand'}</h2>
        <p className="text-sm text-slate-500">{profile.industry || 'Your industry'} • Voice: <span className="font-medium">{profile.tone || '—'}</span></p>
      </header>
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Brand identity</h3>
            {!editing ? <button className="btn btn-outline btn-sheen btn-glow parallax" onClick={()=>setEditing(true)}>Edit</button> : null}
          </div>
          {!editing ? (<p className="text-sm text-slate-700 dark:text-slate-300">{profile.description || 'No description yet. Add one in Onboarding.'}</p>) : (
            <div className="space-y-2">
              <div className="input-wrap"><textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={6} className="input"/></div>
              <div className="flex gap-2 justify-end">
                <ShinyButton onClick={saveDesc} disabled={saving}>{saving ? 'Saving...' : 'Save'}</ShinyButton>
                <button className="btn btn-outline btn-sheen btn-glow parallax" onClick={()=>setEditing(false)} disabled={saving}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Your Brand Visual Library</h3>
          {profile?.images?.length ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {profile.images.map((src, i) => (<img key={i} src={src} className="rounded-lg h-20 w-full object-cover" alt={`b-${i}`}/>))}
            </div>
          ) : (<div className="text-sm text-slate-500">No images yet. Add some in Onboarding.</div>)}
        </div>
      </section>
    </div>
  )
}
