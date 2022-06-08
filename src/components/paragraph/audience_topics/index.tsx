import Link from 'next/link'
import { ParagraphProps, ParagraphMetaInfo } from '@/components/paragraph'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const getTagsList = (fieldTags) => {
  if (!fieldTags) return null

  const {
    field_topics: fieldTopics = [],
    field_audience_beneficiares: fieldAudienceBeneficiares,
  } = fieldTags

  const topics = fieldTopics.map((topic) => ({
    ...topic,
    categoryLabel: 'Topics',
  }))

  const audiences = [fieldAudienceBeneficiares]
    .filter((tag) => !!tag)
    .map((audience) => ({
      ...audience,
      categoryLabel: 'Audience',
    }))

  const tagList = [...topics, ...audiences]

  return tagList.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel))
}

export function AudienceTopics({ paragraph }: ParagraphProps) {
  if (!paragraph) return null
  // Build tag list
  const tags = getTagsList(paragraph)
  // only render tags where length is greater than 0
  if (tags.length === 0) return null

  const tagsList = tags.map((tag) => (
    <div key={tag?.id}>
      <div className="vads-u-margin-right--1 vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--0">
        <Link href={`${tag?.path?.alias}/${tag?.name}`}>
          <a className="vads-u-margin-bottom--1p5 usa-button-secondary vads-u-font-size--sm vads-u-border--1px vads-u-border-color--primary vads-u-padding--0p25 vads-u-padding-x--0p5 vads-u-margin-left--1p5 vads-u-text-decoration--none vads-u-color--base">
            {tag?.name}
          </a>
        </Link>
      </div>
    </div>
  )) // end map

  return (
    <div className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
      <div className="vads-u-padding-top--3 vads-u-padding-bottom--1p5 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-display--flex vads-u-align-items--flex-start vads-u-flex-direction--row">
        <strong className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
          Tags
        </strong>
        <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
          {tagsList}
        </div>
      </div>
    </div>
  )
}

const audienceTopicsParams = new DrupalJsonApiParams().addInclude([
  'field_audience_beneficiares',
  'field_non_beneficiares',
  'field_topics',
])

export const Meta: ParagraphMetaInfo = {
  resource: 'paragraph--audience_topics',
  component: AudienceTopics,
  params: audienceTopicsParams,
}
