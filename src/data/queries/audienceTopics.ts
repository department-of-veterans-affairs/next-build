// Define the query params for fetching node--news_story.
import { ParagraphAudienceTopics } from '@/types/drupal/paragraph'
import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { AudienceTopic, AudienceTopics } from '@/types/formatted/audienceTopics'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_audience_beneficiares',
    'field_non_beneficiares',
    'field_topics',
  ])
}

const getTagsList = (
  entity: ParagraphAudienceTopics
): AudienceTopic[] | null => {
  if (!entity) return null

  const {
    field_topics: fieldTopics = [],
    field_audience_beneficiares: fieldAudienceBeneficiares,
    field_non_beneficiares: fieldNonBeneficiares,
  } = entity

  const topics = fieldTopics.map((topic) => ({
    id: topic.id,
    href: topic.path?.alias,
    name: topic.name,
    categoryLabel: 'Topics',
  }))

  const audiences = [
    ...(fieldAudienceBeneficiares || []),
    ...(fieldNonBeneficiares || []),
  ]
    .filter((tag) => !!tag)
    .map((audience) => ({
      id: audience.id,
      href: audience.path?.alias,
      name: audience.name,
      categoryLabel: 'Audience',
    }))

  const tagList = [...topics, ...audiences]

  return tagList.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel))
}

/**
 * This formatter is unusual in that it takes a paragraph entity and digs into
 * its data to return multiple instances of similar values from it.
 */
export const formatter: QueryFormatter<
  ParagraphAudienceTopics,
  AudienceTopics
> = (entity: ParagraphAudienceTopics) => {
  return {
    type: entity.type as AudienceTopics['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    tags: getTagsList(entity),
  }
}
