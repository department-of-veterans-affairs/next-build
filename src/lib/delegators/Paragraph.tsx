import * as React from 'react'
import { entityMeta } from './entityMetaProvider'
import { ParagraphProps } from '@/types/paragraph'
import { Meta as AudienceTopicsMeta } from '@/components/paragraph/audience_topics'
import { Meta as ButtonMeta } from '@/components/paragraph/button'
import { Meta as EmailContactMeta } from '@/components/paragraph/email_contact'
import { Meta as ExpandableTextMeta } from '@/components/paragraph/expandable_text'
import { Meta as StaffProfileMeta } from '@/components/paragraph/staff_profile'
import { Meta as LinkTeaserMeta } from '@/components/paragraph/link_teaser'
import { Meta as RichTextCharLimit1000Meta } from '@/components/paragraph/rich_text_char_limit_1000'

export function Paragraph({
  paragraph,
  // componentParams,
  ...props
}: ParagraphProps) {
  if (!paragraph) return null

  const Component = entityMeta[paragraph.type].component

  if (!Component) return null

  return (
    <Component
      paragraph={paragraph}
      // componentParams={componentParams}
      {...props}
    />
  )
}
