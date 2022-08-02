import * as React from 'react'
import {
  ParagraphMetaInfo,
  ParagraphMetaOut,
  ParagraphProps,
} from '@/types/paragraph'
import { Meta as ButtonMeta } from '@/components/paragraph/button'
import { Meta as ExpandableTextMeta } from '@/components/expandable_text/dataService'
import { Meta as StaffProfileMeta } from '@/components/paragraph/staff_profile'
import { Meta as LinkTeaserMeta } from '@/components/paragraph/link_teaser'
import { Meta as WysiwygMeta } from '@/components/wysiwyg/dataService'
import { Meta as RichTextCharLimit1000Meta } from '@/components/paragraph/rich_text_char_limit_1000'

/** Collect all imported paragraph meta information. */
const paragraphMetaIn: ParagraphMetaInfo[] = [
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
