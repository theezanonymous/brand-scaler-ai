import React from 'react'
export default function ShinyButton({ children, className='', ...props }){
  return (
    <button {...props} className={`btn btn-primary btn-sheen btn-glow parallax ${className}`}
      onMouseMove={(e)=>{
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width * 100
        const y = (e.clientY - rect.top) / rect.height * 100
        e.currentTarget.style.setProperty('--mx', x+'%')
        e.currentTarget.style.setProperty('--my', y+'%')
      }}>
      {children}
    </button>
  )
}
