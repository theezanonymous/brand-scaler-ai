import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

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
          <span className="text-accent-600">●</span> Social Brand Scaler AI
        </div>
        <nav className="flex items-center gap-1">
          <LinkItem to="/" label="Home" />
          <LinkItem to="/onboarding" label="Brand" />
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
