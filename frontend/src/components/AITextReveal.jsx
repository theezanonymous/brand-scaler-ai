import React, { useEffect, useState } from 'react'

export default function AITextReveal({ text, speed=16 }){
  const [out, setOut] = useState('')
  useEffect(()=>{
    setOut('')
    let i=0
    const id = setInterval(()=>{
      setOut(prev => prev + (text[i]||''))
      i++
      if (i>=text.length) clearInterval(id)
    }, speed)
    return ()=>clearInterval(id)
  }, [text, speed])
  return <p className="leading-relaxed">{out}</p>
}
