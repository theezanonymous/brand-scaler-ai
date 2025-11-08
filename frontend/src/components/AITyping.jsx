import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AITyping({ show=true, label='Thinking…' }){
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-2 text-sm text-slate-500"
        >
          <span>{label}</span>
          <span className="typing-dots inline-flex">
            <span className="mx-0.5 animate-blink">•</span>
            <span className="mx-0.5 animate-blink" style={{animationDelay:'.18s'}}>•</span>
            <span className="mx-0.5 animate-blink" style={{animationDelay:'.36s'}}>•</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
