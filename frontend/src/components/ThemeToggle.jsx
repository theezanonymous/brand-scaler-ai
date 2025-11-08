import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle(){
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className="btn btn-outline btn-sheen btn-glow parallax" title="Toggle theme"
      onMouseMove={(e)=>{
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width * 100
        const y = (e.clientY - rect.top) / rect.height * 100
        e.currentTarget.style.setProperty('--mx', x+'%')
        e.currentTarget.style.setProperty('--my', y+'%')
      }}>
      {theme==='dark' ? <Sun size={18}/> : <Moon size={18}/>}
      <span className="hidden md:inline">{theme==='dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}
