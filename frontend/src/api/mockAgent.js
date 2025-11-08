// Simulated brand-aware agent endpoints
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export async function analyzeBrand({ name, industry, tone, color, logo }){
  await sleep(600)
  const persona = `${name || 'Your brand'} speaks in a ${tone} tone for the ${industry} space, emphasizing clarity and trust.`
  const fingerprint = {
    palette: color || '#4F46E5',
    keywords: ['clarity','trust','momentum','value'],
    voice: tone,
    audience: 'digital-native buyers and engaged community members'
  }
  localStorage.setItem('brand_fingerprint', JSON.stringify({ name, industry, ...fingerprint }))
  return { ok:true, persona, fingerprint }
}

export async function findSimilar({ industry }){
  await sleep(700)
  const brands = [
    { name:'SnackCo', handle:'@snackco', followers: 240000 },
    { name:'FitBrand', handle:'@fitbrand', followers: 125000 },
    { name:'GreenOrg', handle:'@greenorg', followers: 98000 },
  ]
  const posts = [
    { id:'p1', brand:'SnackCo', title:'12s energetic demo', views: 320000, hook:'Face in first 2s + bold caption', length:'12s' },
    { id:'p2', brand:'FitBrand', title:'Before/After quick cut', views: 215000, hook:'Transformation + upbeat track', length:'14s' },
    { id:'p3', brand:'GreenOrg', title:'Cause-driven CTA', views: 163000, hook:'Mission + impact stat overlay', length:'15s' },
  ]
  return { ok:true, brands, posts }
}

export async function generateInsights({ posts }){
  await sleep(600)
  return {
    ok:true,
    summary: 'High-performing posts share fast hooks (<2s), strong human presence, bold on-screen captions, and 12–15s runtime. Posting Tue-Thu 11am–2pm tends to perform best.',
    bullets: [
      'Hook in first 2 seconds increases retention by ~35% (simulated).',
      'Human face + direct address correlates with higher engagement.',
      'Bold captions support silent viewers; include CTA in last 3s.',
      '12–15 seconds is the optimal window for this niche (mock).'
    ]
  }
}

export async function createPosts({ fingerprint }){
  await sleep(650)
  const ideas = [
    {
      id:'idea1',
      title:'Day-in-the-life micro-demo',
      storyboard:[
        '0–2s: Close-up face hook: “Here’s the 10s trick we use…”',
        '2–8s: Quick demo with overlay keywords',
        '8–12s: Benefit punchline + logo color flash',
        '12–15s: CTA: “Tap to see our 3-step guide →”'
      ],
      caption:`We turned 10 seconds into momentum. Here’s how ${fingerprint?.keywords?.[0] || 'clarity'} wins. #ShortForm #${fingerprint?.voice || 'Professional'} #BrandGrowth`
    },
    {
      id:'idea2',
      title:'Before/After with stat overlay',
      storyboard:[
        '0–2s: “Before” shot + bold stat teaser',
        '2–10s: Split-screen reveal with quick cuts',
        '10–15s: CTA overlay to learn more'
      ],
      caption:`Numbers don’t lie — this shift boosted retention. Try it this week. #BeforeAfter #Results`
    },
    {
      id:'idea3',
      title:'Myth-buster carousel/video',
      storyboard:[
        '0–2s: “Myth:” text overlay',
        '2–10s: 3 fast truths w/ iconography',
        '10–15s: CTA to DM for checklist'
      ],
      caption:`We keep it simple: myth → truth → action. Save for your next shoot. #MythBusting #Playbook`
    }
  ]
  return { ok:true, ideas }
}
