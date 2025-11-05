type UrlNormalizer = (urlStr: URL) => string | false

export const normalizeEmbeddedYoutubeUrl: UrlNormalizer = (url: URL) => {
  if (
    !['youtu.be', 'youtube.com', 'www.youtu.be', 'www.youtube.com'].includes(
      url.hostname
    )
  ) {
    // if the URL is not specifically a YouTube URL, do nothing to it
    return false
  }

  const pathParts = url.pathname.split('/')

  const videoId = url.searchParams.get('v') ?? [...pathParts].pop()
  if (!videoId) {
    // unable to determine the video ID, do not change
    return false
  }

  url.hostname = 'www.youtube.com'
  url.pathname = `/embed/${videoId}`
  url.searchParams.delete('v')
  // We want to point to the video's embed page, but may not want to delete all the search params

  return url.toString()
}

const defaultNormalizers: UrlNormalizer[] = [normalizeEmbeddedYoutubeUrl]

export const normalizeEmbeddedVideoUrl = (
  urlStr: string | null | undefined,
  normalizers: UrlNormalizer[] = defaultNormalizers
): string | null => {
  if (urlStr === null || urlStr === undefined) {
    return null
  }

  for (const normalizer of normalizers) {
    let url: URL
    try {
      // A fresh URL is needed for each normalizer because they may mutate the URL passed to them
      // Alternative: Check malformed URL once, but pass a copy to each normalizer (but also create N+1 instead of N)
      url = new URL(urlStr)
    } catch {
      // URL is malformed. Skip the rest of the loop since the other's will fail in the same way.
      // Return original string
      return urlStr
    }

    const outUrl = normalizer(url)
    if (outUrl !== false) return outUrl
  }

  return urlStr
}
