'use client'

import { handleSkipLink } from '@/lib/utils/handleSkipLink'

/**
 * Client component for skip to content link.
 * Extracted from PageLayout to allow PageLayout to be a server component.
 */
export function SkipLink() {
  return (
    <a href="#content" onClick={handleSkipLink} className="show-on-focus">
      Skip to Content
    </a>
  )
}
