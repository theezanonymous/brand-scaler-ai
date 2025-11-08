import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import MouseGlow from './components/MouseGlow.jsx'
import AgentStatusBar from './components/AgentStatusBar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Discover from './pages/Discover.jsx'
import Insights from './pages/Insights.jsx'
import CreateContent from './pages/CreateContent.jsx'
import Dashboard from './pages/Dashboard.jsx'

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
)

export default function App(){
  const location = useLocation()
  return (
    <div className="min-h-screen relative flex flex-col">
      <MouseGlow />
      <Navbar />
      <div className="nav-accent" />
      <AgentStatusBar />
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Landing/></Page>} />
            <Route path="/onboarding" element={<Page><Onboarding/></Page>} />
            <Route path="/discover" element={<Page><Discover/></Page>} />
            <Route path="/insights" element={<Page><Insights/></Page>} />
            <Route path="/create" element={<Page><CreateContent/></Page>} />
            <Route path="/dashboard" element={<Page><Dashboard/></Page>} />
            <Route path="*" element={<Navigate to='/' replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
