import * as React from 'react'
import {
  ParagraphMetaInfo,
  ParagraphProps,
  ParagraphMetaOut,
} from '@/types/paragraph'
import { Meta as AudienceTopicsMeta } from '@/components/paragraph/audience_topics'
import { Meta as ButtonMeta } from '@/components/paragraph/button'
import { Meta as EmailContactMeta } from '@/components/paragraph/email_contact'
import { Meta as ExpandableTextMeta } from '@/components/paragraph/expandable_text'
import { Meta as StaffProfileMeta } from '@/components/paragraph/staff_profile'
import { Meta as LinkTeaserMeta } from '@/components/paragraph/link_teaser'
import { Meta as WysiwygMeta } from '@/components/paragraph/wysiwyg'
/** Collect all imported paragraph meta information. */
const paragraphMetaIn: ParagraphMetaInfo[] = [
  AudienceTopicsMeta,
  ButtonMeta,
  EmailContactMeta,
  ExpandableTextMeta,
  StaffProfileMeta,
  LinkTeaserMeta,
  WysiwygMeta,
]

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
