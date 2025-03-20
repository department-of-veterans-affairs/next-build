import type { FeaturedContent } from '@/types/formatted/featuredContent'
import type { FormattedCta } from '@/types/formatted/cta'
import { processCta } from './cta'
import { ParagraphCCFeaturedContent } from '@/types/drupal/paragraph'

export const processFeaturedContent = (
  featuredContent: ParagraphCCFeaturedContent
): FeaturedContent => {
  if (!featuredContent) {
    return null
  }
  const {
    fetched: {
      field_cta: ctas,
      field_description: descriptions,
      field_section_header: headers,
    },
  } = featuredContent
  const description = descriptions[0].value as string
  const title = headers[0].value as string
  const link = processCta(ctas[0]) as { id: string; url: string; label: string }
  return {
    type: 'paragraph--featured_content',
    id: featuredContent.target_id,
    description,
    title,
    link,
  }
}
