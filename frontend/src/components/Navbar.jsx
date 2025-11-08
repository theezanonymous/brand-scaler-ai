import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar(){
  const { pathname } = useLocation()
  const LinkItem = ({to,label}) => (
    <Link to={to} className={`px-3 py-2 rounded-md text-sm transition hover:bg-slate-100/60 dark:hover:bg-neutral-800/70 ${pathname===to?'bg-slate-100 dark:bg-neutral-800':''}`}>
      {label}
    </Link>
  )
  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b border-slate-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/70">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Link to="/" className="inline-flex items-center gap-2">
            <motion.img
              src="/public/viralight-icon.png"
              alt="Viralight"
              className="h-7 w-7"
              initial={{ opacity: 1, scale: 1 }}
              // animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
              // transition={{ duration: 0.6, ease: 'easeOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 0, times: [0, 0.5, 1], }}
            />
            <span className="hidden sm:inline"><img src="/viralight-wordmark.png" alt="Viralight" className = "viralightWordmark"/></span>
          </Link>
        </div>
        <nav className="flex items-center gap-1">
          <LinkItem to="/" label="Home" />
          <LinkItem to="/onboarding" label="Onboarding" />
          <LinkItem to="/discover" label="Discover" />
          <LinkItem to="/insights" label="Insights" />
          <LinkItem to="/create" label="Create" />
          <LinkItem to="/dashboard" label="Dashboard" />
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
