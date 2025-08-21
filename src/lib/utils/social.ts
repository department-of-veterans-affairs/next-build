export type SocialLink = {
  href: string
  icon?: string | null
  text: string
}

export function getFacebookLink(path: string): SocialLink {
  return {
    icon: 'facebook',
    href: `https://www.facebook.com/sharer/sharer.php?href=${path}`,
    text: 'Share on Facebook',
  }
}

export function getXLink(path: string, title: string): SocialLink {
  return {
    icon: 'x',
    href: `https://twitter.com/intent/tweet?text=${title}&url=${path}`,
    text: 'Share on X (formerly Twitter)',
  }
}

/**
 * Given a URL, return the icon that should be used for the link.
 *
 * @param url - The URL to get the icon for.
 * @returns The va-icon name that should be used for the link or null if no match is found.
 */
export function iconNameFromUrl(url: string) {
  const patterns = [
    { match: 'facebook.com', icon: 'facebook' },
    { match: 'twitter.com', icon: 'x' },
    { match: 'x.com', icon: 'x' },
    { match: 'instagram.com', icon: 'instagram' },
    { match: 'govdelivery.com', icon: 'mail' },
    { match: 'flickr.com', icon: 'flickr' },
    { match: 'youtube.com', icon: 'youtube' },
  ]
  const found = patterns.find(({ match }) => url.includes(match))
  return found ? found.icon : null
}
