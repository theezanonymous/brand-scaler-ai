import React from 'react'
export default function Footer(){
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur py-10 mt-20">
      <div className="container grid md:grid-cols-3 gap-8 text-sm items-start">
        <div className="flex flex-col gap-2">
          {/* <img src="/public/viralight-wordmark.png" alt="Viralight" className="viralightWordmark h-6 w-auto opacity-90" /> */}
          <p className="text-slate-600 dark:text-slate-300">AI-driven brand intelligence and generative video strategy.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1">
            <li><a href="#" className="text-slate-600 dark:text-slate-300 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="text-slate-600 dark:text-slate-300 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="text-slate-600 dark:text-slate-300 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Connect</h4>
          <ul className="space-y-1">
            <li><a href="#" className="text-slate-600 dark:text-slate-300 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">LinkedIn</a></li>
            <li><a href="#" className="text-slate-600 dark:text-slate-300 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">Twitter</a></li>
            <li><a href="#" className="text-slate-600 dark:text-slate-300 hover:underline hover:text-slate-800 dark:hover:text-white transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/50 dark:border-white/10 pt-4">
        © {year} Viralight. All rights reserved.
      </div>
    </footer>
  )
}
