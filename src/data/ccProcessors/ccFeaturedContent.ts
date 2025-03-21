import type { FeaturedContent } from '@/types/formatted/featuredContent'
import { ccCta } from './ccCta'
import { ParagraphCCFeaturedContent } from '@/types/drupal/paragraph'
import { ccStringArrToString } from './ccStringArrToString'

export const processFeaturedContent = (
  featuredContent: ParagraphCCFeaturedContent
): FeaturedContent => {
  if (!featuredContent) {
    return null
  }
  const {
    fetched: {
      field_cta: ctaCC,
      field_description: descriptionCC,
      field_section_header: headerCC,
    },
  } = featuredContent
  const description = ccStringArrToString(descriptionCC)
  const title = ccStringArrToString(headerCC)
  const link = ccCta(ctaCC)
  return {
    type: 'paragraph--featured_content',
    id: featuredContent.target_id,
    description,
    title,
    link,
  }
}
