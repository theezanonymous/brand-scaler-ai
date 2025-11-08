import React, { useEffect, useState } from 'react'

const phrases = [
  'Turn data into creative momentum.',
  'Scale your brand with AI-driven storytelling.',
  'Generate content that performs — and represents you.'
]

export default function TypingHero({ speed=70, pause=1200 }){
  const [pi, setPi] = useState(0)
  const [txt, setTxt] = useState('')
  const [dir, setDir] = useState(1)
  useEffect(() => {
    let t
    if (dir === 1 && txt.length < phrases[pi].length) {
      t = setTimeout(()=> setTxt(phrases[pi].slice(0, txt.length+1)), speed)
    } else if (dir === 1 && txt.length === phrases[pi].length) {
      t = setTimeout(()=> { setDir(-1) }, pause)
    } else if (dir === -1 && txt.length > 0) {
      t = setTimeout(()=> setTxt(phrases[pi].slice(0, txt.length-1)), 30)
    } else if (dir === -1 && txt.length === 0) {
      t = setTimeout(()=> { setPi((pi+1)%phrases.length); setDir(1) }, 100)
    }
    return ()=> clearTimeout(t)
  }, [txt, dir, pi, speed, pause])

  return (
    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent-500 to-pop-500">
      <span>{txt}</span>
      <span className="border-r-2 border-accent-500 ml-1 animate-blink">&nbsp;</span>
    </h1>
  )
}
