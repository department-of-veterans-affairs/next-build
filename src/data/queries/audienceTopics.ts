// Define the query params for fetching node--news_story.
import { ParagraphAudienceTopics } from '@/types/dataTypes/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { AudienceTopicType } from '@/types/index'

const getTagsList = (fieldTags) => {
  if (!fieldTags) return null

  const {
    field_topics: fieldTopics = [],
    field_audience_beneficiares: fieldAudienceBeneficiares,
    fieldNonBeneficiares: fieldNonBeneficiares,
  } = fieldTags

  const topics = fieldTopics.map((topic) => ({
    id: topic.id,
    href: topic.path?.alias,
    name: topic.name,
    categoryLabel: 'Topics',
  }))

  const audiences = [fieldAudienceBeneficiares, fieldNonBeneficiares]
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
  AudienceTopicType[]
> = (entity: ParagraphAudienceTopics) => {
  return getTagsList(entity)
}
