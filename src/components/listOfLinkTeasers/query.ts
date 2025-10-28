import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { ParagraphListOfLinkTeasers } from '@/types/drupal/paragraph'
import { ListOfLinkTeasers } from '@/components/listOfLinkTeasers/formatted-type'
import { formatter as formatLinkTeaser } from '@/components/linkTeaser/query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const params: QueryParams<null> = () =>
  new DrupalJsonApiParams().addInclude(['field_va_paragraphs'])

export const formatter: QueryFormatter<
  ParagraphListOfLinkTeasers,
  ListOfLinkTeasers | null
> = (entity: ParagraphListOfLinkTeasers) => {
  const linkTeasers = entity.field_va_paragraphs
    .map(formatLinkTeaser)
    .filter((linkTeaser) => linkTeaser !== null)
  if (linkTeasers.length === 0) return null
  return {
    type: entity.type as ListOfLinkTeasers['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id ?? null,
    title: entity.field_title,
    linkTeasers: linkTeasers,
    isHubPage: false,
    ...(entity.parent_field_name && { parentField: entity.parent_field_name }),
  }
}
