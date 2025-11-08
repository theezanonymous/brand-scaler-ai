import { useEffect } from 'react'
export default function useMousePosition(){
  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      document.documentElement.style.setProperty('--mx', `${x*100}%`)
      document.documentElement.style.setProperty('--my', `${y*100}%`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return null
}
