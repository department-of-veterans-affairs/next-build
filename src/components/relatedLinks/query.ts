import { QueryFormatter } from 'next-drupal-query'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import { NodeHealthCareRegionPage } from '@/types/drupal/node'
import { FormattedRelatedLinks } from '@/components/relatedLinks/formatted-type'

export const formatter: QueryFormatter<
  NodeHealthCareRegionPage,
  FormattedRelatedLinks
> = (entity: NodeHealthCareRegionPage) => {
  const links = entity.field_related_links?.field_va_paragraphs
    .slice(0, 8)
    // Adding the type annotation because TS doesn't apparently pick up on
    // this since we've done an Omit<> on the parent type.
    .map((linkTeaser: ParagraphLinkTeaser) => {
      if (!linkTeaser.field_link) {
        throw new Error(
          'Missing `field_related_links.field_va_paragraphs` include'
        )
      }
      return {
        title: linkTeaser.field_link.title,
        uri: linkTeaser.field_link.url,
        // summary: ''
      }
    })
  return {
    sectionTitle: entity.title
      ? `Other services at ${entity.title}`
      : (entity.field_related_links?.field_title ?? ''),
    links: links ?? null,
  }
}
