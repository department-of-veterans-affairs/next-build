import * as React from 'react'
import {
  ParagraphMetaInfo,
  ParagraphMetaOut,
  ParagraphProps,
} from '@/types/paragraph'
import { Meta as AudienceTopicsMeta } from 'templates/components/audience_topics/dataService'
import { Meta as ButtonMeta } from 'templates/common/button/dataService'
import { Meta as EmailContactMeta } from 'templates/components/email_contact/dataService'
import { Meta as ExpandableTextMeta } from 'templates/components/expandable_text/dataService'
import { Meta as StaffProfileMeta } from 'templates/layouts/staffProfile/dataService'
import { Meta as LinkTeaserMeta } from 'templates/components/linkTeaser/dataService'
import { Meta as WysiwygMeta } from 'templates/components/wysiwyg/dataService'
import { Meta as RichTextCharLimit1000Meta } from 'templates/components/richTextCharLimit1000/dataService'

/** Collect all imported paragraph meta information. */
const paragraphMetaIn: ParagraphMetaInfo[] = [
  AudienceTopicsMeta,
  EmailContactMeta,
  ButtonMeta,
  ExpandableTextMeta,
  StaffProfileMeta,
  LinkTeaserMeta,
  WysiwygMeta,
  RichTextCharLimit1000Meta,
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
