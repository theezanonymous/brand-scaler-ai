import React, { useEffect, useRef } from 'react'

// Subtle professional background bubbles
export default function AnimatedBubbles(){
  const ref = useRef(null)
  useEffect(()=>{
    const el = ref.current
    let raf, t=0
    const render = () => {
      t+=0.002
      el.style.background = `radial-gradient(600px 600px at ${50+Math.sin(t)*10}% ${50+Math.cos(t*1.2)*8}%, rgba(99,102,241,0.08), transparent 60%), radial-gradient(800px 600px at ${30+Math.cos(t*0.8)*12}% ${60+Math.sin(t*1.4)*10}%, rgba(99,102,241,0.06), transparent 60%)`
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)
    return ()=> cancelAnimationFrame(raf)
  },[])
  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 transition-colors" />
}
