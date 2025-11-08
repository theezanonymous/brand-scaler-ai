import React from 'react'
import useMousePosition from '../hooks/useMousePosition'

export default function MouseGlow(){
  useMousePosition() // sets CSS vars --mx/--my
  return <div className="mouse-glow" />
}
