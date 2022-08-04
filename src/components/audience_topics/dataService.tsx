import {
  ParagraphAudienceTopics,
  ParagraphResourceType,
} from '@/types/paragraph'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import { AudienceTopics } from './index'

export const getTagsList = (fieldTags) => {
  if (!fieldTags) return null

  const {
    field_topics: fieldTopics = [],
    field_audience_beneficiares: fieldAudienceBeneficiares,
    fieldNonBeneficiares: fieldNonBeneficiares,
  } = fieldTags

  const topics = fieldTopics.map((topic) => ({
    id: topic?.id,
    href: topic?.path?.alias,
    name: topic?.name,
    categoryLabel: 'Topics',
  }))

  const audiences = [fieldAudienceBeneficiares, fieldNonBeneficiares]
    .filter((tag) => !!tag)
    .map((audience) => ({
      id: audience?.id,
      href: audience?.path?.alias,
      name: audience?.name,
      categoryLabel: 'Audience',
    }))

  const tagList = [...topics, ...audiences]

  return tagList.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel))
}

export const transformAudienceTopicsData = function (
  entity: ParagraphAudienceTopics,
  viewMode: string
) {
  switch (viewMode) {
    default:
      return {
        id: entity?.id,
        tags: getTagsList(entity),
      }
  }
}

const audienceTopicsParams = new DrupalJsonApiParams().addInclude([
  'field_audience_beneficiares',
  'field_non_beneficiares',
  'field_topics',
])

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.AudienceTopics,
  component: AudienceTopics,
  params: audienceTopicsParams,
  dataService: transformAudienceTopicsData,
}
