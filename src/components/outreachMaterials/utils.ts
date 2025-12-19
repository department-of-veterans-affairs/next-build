const HUB_IMAGE_BASE_URL = 'https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/img/hub-illustrations/'

/**
 * Get topic image path based on topic ID
 * @param topicId - Topic ID (e.g., "general", "burials", "careers")
 * @returns Full S3 path to hub illustration image
 */
export function getTopicImagePath(topicId: string | undefined): string {
  const topicFilenames: Record<string, string> = {
    general: 'records.png',
    burials: 'burials.png',
    careers: 'careers.png',
    disability: 'disability.png',
    education: 'education.png',
    family: 'family-caregiver.png',
    healthcare: 'health-care.png',
    housing: 'housing.png',
    insurance: 'life-insurance.png',
    pension: 'pension.png',
    service: 'service-member.png',
    records: 'records.png',
  }
  const filename = topicFilenames[topicId || ''] || 'records.png'
  return `${HUB_IMAGE_BASE_URL}${filename}`
}

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
