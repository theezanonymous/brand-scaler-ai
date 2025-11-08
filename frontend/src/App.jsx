import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import MouseGlow from './components/MouseGlow'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Discover from './pages/Discover'
import Insights from './pages/Insights'
import CreateContent from './pages/CreateContent'
import Dashboard from './pages/Dashboard'

export default function App(){
  return (
    <div className="min-h-screen relative">
      <MouseGlow />
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/onboarding" element={<Onboarding/>} />
          <Route path="/discover" element={<Discover/>} />
          <Route path="/insights" element={<Insights/>} />
          <Route path="/create" element={<CreateContent/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="*" element={<Navigate to='/' replace />} />
        </Routes>
      </main>
    </div>
  )
}
