import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, BarChart3, Video } from 'lucide-react'
import ShinyButton from '../components/ShinyButton.jsx'
import TypingHero from '../components/TypingHero.jsx'

export default function Landing(){
  const cardVar = { hidden:{opacity:0, y:20}, show:{opacity:1, y:0, transition:{duration:0.5, ease:'easeOut'}} }
  return (
    <div className="relative overflow-hidden">
      <img style={{top: "5vh",left: "55vw", position: "absolute", width:"40vw"}} src="/landImg.png" alt="" className = "landingImg" />
      <div className="relative min-h-screen flex flex-col justify-center text-left container space-y-8 py-20">
        <motion.div className="hero-orb w-96 h-96 bg-gradient-to-tr from-accent-500/40 to-transparent -top-24 -left-24 absolute"
          animate={{ x:[0,40,0], y:[0,20,0] }} transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="hero-orb w-96 h-96 bg-gradient-to-bl from-pop-500/35 to-transparent bottom-0 right-0 absolute"
          animate={{ x:[0,-30,0], y:[0,-20,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }} />
        <div className="relative z-10 max-w-3xl space-y-6">
          <TypingHero />
          <motion.p initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25, duration:.4 }}
            className="max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Harness generative video intelligence built for modern brands. Our agent studies what performs across your industry,
            understands your tone and visuals, and produces short-form videos designed to engage, convert, and scale.
          </motion.p>
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.35, duration:.4 }} className="flex gap-3 flex-wrap">
            <Link to="/onboarding"><ShinyButton>Get Started</ShinyButton></Link>
            <Link to="/discover" className="btn btn-outline btn-sheen btn-glow parallax">See Discovery</Link>
          </motion.div>
        </div>
      </div>
      {/* Divider */}
      <div className="bg-gradient-to-r from-accent-500/20 via-pop-500/20 to-transparent h-[2px]" />
      {/* How It Works */}
      <section className="relative py-24 bg-white dark:bg-neutral-950">
        <div className="container space-y-10">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true, amount:0.25 }}
            variants={{ show:{ transition:{ staggerChildren:0.18 } } }} className="grid md:grid-cols-3 gap-10">
            <motion.div variants={cardVar} className="card p-6 text-left hover:shadow-lift transition">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-500 to-pop-500 flex items-center justify-center mb-4">
                <Brain className="text-white" size={22}/>
              </div>
              <h3 className="font-semibold mb-2">Understand Your Brand</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Upload your visuals, describe your tone, and define your goals. Our AI agent learns what makes your brand unique.
              </p>
            </motion.div>
            <motion.div variants={cardVar} className="card p-6 text-left hover:shadow-lift transition">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-500 to-pop-500 flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={22}/>
              </div>
              <h3 className="font-semibold mb-2">Analyze the Market</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                The system studies what performs across your niche and highlights strategies that actually convert.
              </p>
            </motion.div>
            <motion.div variants={cardVar} className="card p-6 text-left hover:shadow-lift transition">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-500 to-pop-500 flex items-center justify-center mb-4">
                <Video className="text-white" size={22}/>
              </div>
              <h3 className="font-semibold mb-2">Generate AI Video Concepts</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Instantly create personalized short-form video drafts built from proven patterns, tuned to your brand’s identity.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
