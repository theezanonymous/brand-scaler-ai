import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Send business information to the backend buffer endpoint
 * @param {Object} businessInfo - Business information object
 * @param {string} businessInfo.name - Brand name
 * @param {string} businessInfo.industry - Industry
 * @param {string} businessInfo.tone - Brand tone
 * @param {string} businessInfo.color - Accent color
 * @param {string} businessInfo.description - Brand description
 * @param {string} video_filename - Optional video filename to associate
 * @returns {Promise<{id: number}>} Response with entry ID
 */
export async function sendBusinessInfo(businessInfo, video_filename = null) {
  try {
    // Format the business information as text (excluding images)
    const text = JSON.stringify({
      name: businessInfo.name,
      industry: businessInfo.industry,
      tone: businessInfo.tone,
      color: businessInfo.color,
      description: businessInfo.description,
    }, null, 2)

    const payload = { text }
    if (video_filename) {
      payload.video_filename = video_filename
    }

    const response = await api.post('/buffer', payload)
    return response.data
  } catch (error) {
    console.error('Error sending business info to backend:', error)
    throw error
  }
}

/**
 * Get video by entry ID
 * @param {number} entryId - Entry ID from buffer
 * @returns {Promise<Blob>} Video blob
 */
export async function getVideo(entryId) {
  try {
    const response = await api.get(`/video/${entryId}`, {
      responseType: 'blob',
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching video ${entryId}:`, error)
    throw error
  }
}

/**
 * Get video URL for use in video elements
 * @param {number} entryId - Entry ID from buffer
 * @returns {string} Video URL
 */
export function getVideoUrl(entryId) {
  return `${API_BASE_URL}/video/${entryId}`
}

/**
 * Get mapping information (for debugging/development)
 * @returns {Promise<Object>} Mapping object
 */
export async function getMapping() {
  try {
    const response = await api.get('/_mapping')
    return response.data
  } catch (error) {
    console.error('Error fetching mapping:', error)
    throw error
  }
}

// Keep mock functions for features not yet implemented in backend
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export async function scoutDiscovery() {
  await sleep(300)
  return {
    brands: [
      { name: 'LumaWear', handle: '@lumawear', followers: 264000, tags: ['apparel', 'performance'] },
      { name: 'PeakFuel', handle: '@peakfuel', followers: 138500, tags: ['supplements', 'energy'] },
      { name: 'EcoMuse', handle: '@ecomuse', followers: 101200, tags: ['eco', 'lifestyle'] }
    ],
    reels: [
      { id: 'd1', brand: 'LumaWear', views: 342000, length: '12s', hook: 'Face + bold claim at 0:01' },
      { id: 'd2', brand: 'PeakFuel', views: 228000, length: '14s', hook: 'Split-screen before/after + upbeat track' },
      { id: 'd3', brand: 'EcoMuse', views: 171000, length: '15s', hook: 'Mission line + stat overlay' }
    ]
  }
}

export async function insightsReport() {
  await sleep(300)
  return {
    summary: 'Top performers share fast hooks (<1.5s), human presence, and visible captions. Ideal length: 12–15s.',
    commonHooks: ['Before/after proof', 'Face-to-camera open', 'Bold on-screen text'],
    tones: ['Confident', 'Helpful', 'Playful'],
    ctas: ['Tap to see steps', 'DM for checklist', 'Shop link in bio']
  }
}

/**
 * Generate content concepts and send to backend
 * This function generates content concepts and sends them to the backend
 * @param {Array<string>} images - Optional array of image data URLs (for display only, not sent to backend)
 * @returns {Promise<Array>} Array of post preview objects
 */
export async function pairImagesWithDrafts(images = []) {
  await sleep(900)
  
  // Get current business profile from localStorage
  const profile = JSON.parse(localStorage.getItem('brand_profile') || '{}')
  
  // Generate a fixed number of concepts (6)
  const numConcepts = 6
  const times = ['Tuesday @ 12 PM', 'Wednesday @ 11 AM', 'Thursday @ 2 PM']
  const hooks = [
    'Show — your product in motion.',
    'The glow test: proof in seconds.',
    'Confidence in every frame.',
    'Bold claims, real results.',
    'The moment that changes everything.',
    'Proof that speaks louder.'
  ]
  const captions = [
    'Proof, not promises. Capture authenticity in 12 seconds.',
    'Short, bold, and honest — win the scroll.',
    'Speak visually. Keep it bright, keep it true.',
    'Every second counts. Make them count for you.',
    'Authenticity wins. Show your truth.',
    'The scroll stops here. Make it worth it.'
  ]

  const results = []
  
  for (let i = 0; i < numConcepts; i++) {
    try {
      // Send business info to backend
      const bufferResponse = await sendBusinessInfo(profile)
      const entryId = bufferResponse.id

      // Use image if available, otherwise use placeholder
      const image = images[i] || `https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Concept+${i + 1}`

      results.push({
        id: entryId,
        entry_id: entryId, // Store entry ID for video retrieval
        image: image,
        hook: hooks[i % hooks.length],
        caption: captions[i % captions.length],
        metrics: { likes: 1800 + 200 * i, comments: 80 + 10 * i },
        bestTime: `Best time: ${times[i % times.length]}`,
        hasVideo: false, // Will be set to true if video is available
      })
    } catch (error) {
      console.error(`Error processing concept ${i}:`, error)
      // Fallback: create entry without backend call
      const image = images[i] || `https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Concept+${i + 1}`
      results.push({
        id: i,
        entry_id: null,
        image: image,
        hook: hooks[i % hooks.length],
        caption: captions[i % captions.length],
        metrics: { likes: 1800 + 200 * i, comments: 80 + 10 * i },
        bestTime: `Best time: ${times[i % times.length]}`,
        hasVideo: false,
      })
    }
  }

  return results
}

