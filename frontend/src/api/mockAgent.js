// Simulated endpoints for the agent
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export async function scoutDiscovery(){
  await sleep(300);
  return {
    brands: [
      { name:'LumaWear', handle:'@lumawear', followers: 264000, tags:['apparel','performance'] },
      { name:'PeakFuel', handle:'@peakfuel', followers: 138500, tags:['supplements','energy'] },
      { name:'EcoMuse', handle:'@ecomuse', followers: 101200, tags:['eco','lifestyle'] }
    ],
    reels: [
      { id:'d1', brand:'LumaWear', views: 342000, length:'12s', hook:'Face + bold claim at 0:01' },
      { id:'d2', brand:'PeakFuel', views: 228000, length:'14s', hook:'Split-screen before/after + upbeat track' },
      { id:'d3', brand:'EcoMuse', views: 171000, length:'15s', hook:'Mission line + stat overlay' }
    ]
  }
}

export async function insightsReport(){
  await sleep(300);
  return {
    summary: 'Top performers share fast hooks (<1.5s), human presence, and visible captions. Ideal length: 12–15s.',
    commonHooks: ['Before/after proof','Face-to-camera open','Bold on-screen text'],
    tones: ['Confident','Helpful','Playful'],
    ctas: ['Tap to see steps','DM for checklist','Shop link in bio']
  }
}

export async function pairImagesWithDrafts(images = []){
  await sleep(900);
  const times = ['Tuesday @ 12 PM','Wednesday @ 11 AM','Thursday @ 2 PM']
  return images.slice(0,6).map((img,i)=>({
    id: i,
    image: img,
    hook: ['Show — your product in motion.','The glow test: proof in seconds.','Confidence in every frame.'][i % 3],
    caption: ['Proof, not promises. Capture authenticity in 12 seconds.','Short, bold, and honest — win the scroll.','Speak visually. Keep it bright, keep it true.'][i % 3],
    metrics: { likes: 1800+200*i, comments: 80+10*i },
    bestTime: `Best time: ${times[i % times.length]}`
  }))
}
