/**
 * Format file size in bytes to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.23KB" or "2.45MB")
 */
export function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return ''
  if (bytes < 10000) {
    return `${(bytes / 1000).toFixed(2)}KB`
  }
  return `${(bytes / 1000000).toFixed(2)}MB`
}

/**
 * Extract file extension from URL or filename
 * @param url - URL or filename
 * @returns File extension in uppercase (e.g., "PDF")
 */
export function getFileExtension(url: string | null | undefined): string {
  if (!url) return ''
  const parts = url.toString().split('.')
  return parts.length > 1 ? parts.pop()?.toUpperCase() || '' : ''
}

/**
 * Get YouTube thumbnail URL from embed URL
 * @param embedUrl - YouTube embed URL
 * @returns Thumbnail URL or null
 */
export function getYouTubeThumbnail(embedUrl: string | null | undefined): string | null {
  if (!embedUrl) return null
  try {
    const url = new URL(embedUrl)
    const videoId = url.searchParams.get('v') || url.pathname.split('/').pop()
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
    }
  } catch {
    // If URL parsing fails, try to extract video ID from string
    const match = embedUrl.match(/[?&]v=([^&]+)/)
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/sddefault.jpg`
    }
  }
  return null
}

/**
 * Get topic image path based on topic ID
 * @param topicId - Topic ID (e.g., "general", "burial", "careers")
 * @returns Path to hub illustration image
 */
export function getTopicImagePath(topicId: string | undefined): string {
  const topicMap: Record<string, string> = {
    general: '/img/hub-illustrations/records.png',
    burials: '/img/hub-illustrations/burials.png',
    careers: '/img/hub-illustrations/careers.png',
    disability: '/img/hub-illustrations/disability.png',
    education: '/img/hub-illustrations/education.png',
    family: '/img/hub-illustrations/family-caregiver.png',
    healthcare: '/img/hub-illustrations/health-care.png',
    housing: '/img/hub-illustrations/housing.png',
    insurance: '/img/hub-illustrations/life-insurance.png',
    pension: '/img/hub-illustrations/pension.png',
    service: '/img/hub-illustrations/service-member.png',
    records: '/img/hub-illustrations/records.png',
  }
  return topicMap[topicId || ''] || '/img/hub-illustrations/records.png'
}

/**
 * Build unique list of topics from assets
 * @param assets - Array of outreach assets
 * @returns Sorted array of unique topics
 */
export function buildTopicList(
  assets: Array<{ categories: Array<{ name: string; topicId: string }> }>
): Array<{ name: string; topicId: string }> {
  const topicMap = new Map<string, { name: string; topicId: string }>()
  
  assets.forEach((asset) => {
    asset.categories.forEach((cat) => {
      if (cat.topicId && !topicMap.has(cat.topicId)) {
        topicMap.set(cat.topicId, { name: cat.name, topicId: cat.topicId })
      }
    })
  })
  
  return Array.from(topicMap.values()).sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
}

