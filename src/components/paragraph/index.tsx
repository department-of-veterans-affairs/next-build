import * as React from 'react'
import { ParagraphTypes } from '@/types/paragraph'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { Meta as AudienceTopicsMeta } from '@/components/paragraph/audience_topics'
import { Meta as ButtonMeta } from '@/components/paragraph/button'
import { Meta as EmailContactMeta } from '@/components/paragraph/email_contact'
import { Meta as ExpandableTextMeta } from '@/components/paragraph/expandable_text'
import { Meta as StaffProfileMeta } from '@/components/paragraph/staff_profile'
import { Meta as LinkTeaserMeta } from '@/components/paragraph/link_teaser'

/** General ParagraphProps to pass paragraphs into paragraph components. */
export interface ParagraphProps {
  paragraph: ParagraphTypes
  componentParams?
}

/** Each Paragraph component must export a ParagraphMetaInfo object `Meta`. This information helps next-build associate Drupal resource types with information for rendering them.
 *
 * Example, from {@link AudienceTopics}:
 * ```
 const params = new DrupalJsonApiParams().addInclude([
 'field_topics',
 'field_audience_beneficiares.image',
 ])

 export const Meta: ParagraphMetaInfo = {
  resource: 'paragraph--audience_topics',
  component: AudienceTopics,
  params: params,
}
 * ```
 */
export interface ParagraphMetaInfo {
  /** Identifier for a Drupal data object. These are of the form `entity_type--entity_bundle`, for example `paragraph--audience_topics`. */
  resource: string
  /** The component responsible for rendering or delegating rendering this data object. */
  component: ({ paragraph, ...props }: ParagraphProps) => JSX.Element
  /** A DrupalJsonApiParams object containing information necessary for the API query for this data object. */
  params?: DrupalJsonApiParams
}

/** Collect all imported paragraph meta information. */
const paragraphMetaIn: ParagraphMetaInfo[] = [
  AudienceTopicsMeta,
  ButtonMeta,
  EmailContactMeta,
  ExpandableTextMeta,
  StaffProfileMeta,
  LinkTeaserMeta,
]

/** This interface enforces that the Paragraph meta information is indexable by type. */
interface ParagraphMetaOut {
  [resource: string]: {
    component: ({ paragraph, componentParams }: ParagraphProps) => JSX.Element
    params?: DrupalJsonApiParams
  }
}

/** Converts the meta information into a form indexed by resource type. */
export const paragraphMeta: ParagraphMetaOut = paragraphMetaIn.reduce(
  (acc, current) => {
    const { resource, component, params } = current
    acc[resource] = {
      component: component,
      params: params,
    }
    return acc
  },
  {}
)

export function Paragraph({
  paragraph,
  componentParams,
  ...props
}: ParagraphProps) {
  if (!paragraph) return null

  const Component = paragraphMeta[paragraph.type].component

  if (!Component) return null

  return (
    <Component
      paragraph={paragraph}
      componentParams={componentParams}
      {...props}
    />
  )
}
