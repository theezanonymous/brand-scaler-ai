import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeBrand } from '../api/mockAgent'
import ShinyButton from '../components/ShinyButton'

export default function Onboarding(){
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [tone, setTone] = useState('professional')
  const [color, setColor] = useState('#4F46E5')
  const [logo, setLogo] = useState(null)
  const [persona, setPersona] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const uploadLogo = (e) => {
    const f = e.target.files[0]; if(!f) return
    const rd = new FileReader()
    rd.onload = ev => setLogo(ev.target.result)
    rd.readAsDataURL(f)
  }

  const next = async (e) => {
    e.preventDefault()
    setLoading(true)
    const r = await analyzeBrand({ name, industry, tone, color, logo })
    setLoading(false)
    if (r.ok) {
      setPersona(r.persona)
      setTimeout(()=> navigate('/discover'), 700)
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto card p-8">
        <h2 className="text-2xl font-semibold mb-6">1) Understand your brand</h2>
        <form onSubmit={next} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm block mb-1">Brand name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2" placeholder="LumaWear, PeakFuel, EcoMuse…" />
            </div>
            <div>
              <label className="text-sm block mb-1">Industry</label>
              <input value={industry} onChange={e=>setIndustry(e.target.value)} className="w-full rounded border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2" placeholder="Apparel, Energy, Sustainability…" />
            </div>
            <div>
              <label className="text-sm block mb-1">Tone</label>
              <select value={tone} onChange={e=>setTone(e.target.value)} className="w-full rounded border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2">
                <option>professional</option>
                <option>helpful</option>
                <option>bold</option>
                <option>witty</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1">Accent color</label>
              <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="h-10 w-16 rounded border border-slate-300 dark:border-neutral-700" />
            </div>
          </div>
          <div>
            <label className="text-sm block mb-1">Logo (optional)</label>
            <input type="file" accept="image/*" onChange={uploadLogo}/>
            {logo && <img src={logo} alt="logo" className="mt-3 h-20 w-20 object-contain rounded bg-white p-2 border border-slate-200 dark:border-neutral-800"/>}
            <div className="mt-6 p-3 rounded border border-slate-200 dark:border-neutral-800" style={{borderColor: color}}>
              <div className="text-xs text-slate-500">Preview</div>
              <div className="font-medium" style={{color}}>Primary accent</div>
              <div className="text-sm mt-1 text-slate-600 dark:text-slate-300">{persona || 'We’ll infer your brand voice and audience focus.'}</div>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <ShinyButton>{loading ? 'Analyzing…' : 'Continue to discovery'}</ShinyButton>
          </div>
        </form>
      </div>
    </div>
  )
}
