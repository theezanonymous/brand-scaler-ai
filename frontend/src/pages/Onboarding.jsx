import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ShinyButton from '../components/ShinyButton.jsx'
import { sendBusinessInfo } from '../api/api.js'

export default function Onboarding(){
  const [name, setName] = useState('Viralight')
  const [industry, setIndustry] = useState('')
  const [tone, setTone] = useState('professional')
  const [color, setColor] = useState('#8b5cf6')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
    const existing = JSON.parse(localStorage.getItem('brand_profile') || '{}')
    if(existing && Object.keys(existing).length){
      setName(existing.name || 'Viralight'); setIndustry(existing.industry || ''); setTone(existing.tone || 'professional')
      setColor(existing.color || '#8b5cf6'); setDescription(existing.description || ''); setImages(existing.images || [])
    }
  }, [])
  const onSelect = (e)=>{
    const files = e.target.files; if(!files || !files.length) return
    const arr = Array.from(files)
    Promise.all(arr.map(f=> new Promise(res=>{ const r = new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(f) })))
      .then(urls => setImages(prev => [...prev, ...urls]))
  }
  const removeAt = (idx)=> setImages(prev => prev.filter((_,i)=>i!==idx))
  const save = async (e)=>{ 
    e.preventDefault()
    setSaving(true)
    try {
      const profile = { name, industry, tone, color, description, images }
      // Save to localStorage
      localStorage.setItem('brand_profile', JSON.stringify(profile))
      // Send to backend
      await sendBusinessInfo(profile)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving business info:', error)
      alert('Failed to save to backend. Profile saved locally only.')
      navigate('/dashboard')
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto card p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">Brand Profile</h2>
          <p className="text-sm text-slate-500">Update anything — the video model adapts strategy instantly.</p>
        </div>
        <form onSubmit={save} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm block">Brand Name</label>
            <div className="input-wrap"><input value={name} onChange={e=>setName(e.target.value)} className="input" placeholder="Brand name"/></div>
            <label className="text-sm block">Industry</label>
            <div className="input-wrap"><input value={industry} onChange={e=>setIndustry(e.target.value)} className="input" placeholder="Apparel, Energy, Sustainability…"/></div>
            <label className="text-sm block">Tone</label>
            <div className="input-wrap">
              <select value={tone} onChange={e=>setTone(e.target.value)} className="input">
                <option>professional</option><option>helpful</option><option>bold</option><option>witty</option>
              </select>
            </div>
            <label className="text-sm block">Accent color</label>
            <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-10 w-16 rounded border border-slate-300 dark:border-neutral-700" />
          </div>
          <div className="space-y-3">
            <label className="text-sm block">Describe your brand</label>
            <div className="input-wrap"><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={10} className="input" placeholder="Voice, audience, story, values, visual style…"/></div>
            <div className="text-xs text-slate-500">Used by the AI video model to shape Reel pacing, captions, and visuals.</div>
          </div>
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-semibold">Upload brand photos</h3>
            <input type="file" accept="image/*" multiple onChange={onSelect} />
            {images.length>0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-3">
                {images.map((src,i)=>(
                  <div key={i} className="thumb relative">
                    <img src={src} alt={`u-${i}`} className="rounded"/>
                    <button type="button" onClick={()=>removeAt(i)} className="absolute top-1 right-1 bg-white/90 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-md px-2 py-1 text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" className="btn btn-outline btn-sheen btn-glow parallax" onClick={()=>navigate('/dashboard')} disabled={saving}>Cancel</button>
            <ShinyButton disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</ShinyButton>
          </div>
        </form>
      </div>
    </div>
  )
}
