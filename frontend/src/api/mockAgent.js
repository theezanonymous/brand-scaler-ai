// Simulated brand-aware agent endpoints
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export async function analyzeBrand({ name, industry, tone, color, logo }){
  await sleep(500)
  const persona = `Hey — I took another look at your brand. ${name || 'Your brand'} sounds ${tone} and confident, right at home in ${industry || 'your space'}. Let’s lean into clarity, proof, and a little personality.`
  const fingerprint = {
    palette: color || '#4F46E5',
    keywords: ['clarity','trust','momentum','value'],
    voice: tone || 'professional',
    audience: 'digital-native buyers and engaged community members'
  }
  localStorage.setItem('brand_fingerprint', JSON.stringify({ name, industry, ...fingerprint }))
  return { ok:true, persona, fingerprint }
}

export async function findSimilar({ industry }){
  await sleep(600)
  const brands = [
    { name:'LumaWear', handle:'@lumawear', followers: 264000 },
    { name:'PeakFuel', handle:'@peakfuel', followers: 138500 },
    { name:'EcoMuse', handle:'@ecomuse', followers: 101200 },
  ]
  const posts = [
    { id:'p1', brand:'LumaWear', title:'12s try-on micro-reel', views: 342000, hook:'Face + bold on-screen claim at 0:01', length:'12s' },
    { id:'p2', brand:'PeakFuel', title:'Before/After energy test', views: 228000, hook:'Split-screen + upbeat track', length:'14s' },
    { id:'p3', brand:'EcoMuse', title:'Cause + quick benefit', views: 171000, hook:'Mission line + stat overlay', length:'15s' },
  ]
  localStorage.setItem('similar_posts', JSON.stringify(posts))
  return { ok:true, brands, posts }
}

export async function generateInsights({ posts }){
  await sleep(600)
  return {
    ok:true,
    week: 'This Week',
    summary: 'Short, story-led clips are winning — especially ones that open with a human moment and a reason to care. Quick hooks (<2s), clear captions, and 12–15s runtimes are consistently pulling better watch time.',
    bullets: [
      'Lead with “why” in the first two seconds to stop the scroll.',
      'Faces + direct address feel personal and lift engagement.',
      'Bold captions help silent viewers follow the story.',
      '12–15s hits the sweet spot for this audience.'
    ],
    recommendations: [
      'Post 3x this week (Tue–Thu around lunch).',
      'Test “face-camera hook” vs “product macro hook.”',
      'Close with a clear CTA — tap to see the next step.'
    ]
  }
}

export async function createPosts({ fingerprint }){
  await sleep(650)
  const k0 = fingerprint?.keywords?.[0] || 'clarity'
  const voice = fingerprint?.voice || 'professional'
  const ideas = [
    {
      id:'idea1',
      title:'Micro-demo with a human opener',
      storyboard:[
        '0–2s: Close-up + “Here’s the 10s trick we use…”',
        '2–8s: Quick demo with overlay keywords',
        '8–12s: Benefit punchline + accent color flash',
        '12–15s: CTA: “Tap to see our 3-step guide →”'
      ],
      caption:`Every scroll needs a reason to stop. Lead with the why — let ${k0} do the talking. #ShortForm #${voice} #BrandGrowth`
    },
    {
      id:'idea2',
      title:'Before/After split with stat',
      storyboard:[
        '0–2s: “Before” shot + bold stat teaser',
        '2–10s: Split-screen reveal with quick cuts',
        '10–15s: CTA overlay to learn more'
      ],
      caption:`Results over promises. Keep it tight, then invite action. #BeforeAfter #Momentum`
    },
    {
      id:'idea3',
      title:'Myth → Truth → Action',
      storyboard:[
        '0–2s: “Myth:” text overlay',
        '2–10s: Three fast truths with icons',
        '10–15s: CTA to DM for checklist'
      ],
      caption:`Make it effortless to understand — and easy to act. Save for later. #MythBusting`
    }
  ]
  localStorage.setItem('generated_ideas', JSON.stringify(ideas))
  return { ok:true, ideas }
}
