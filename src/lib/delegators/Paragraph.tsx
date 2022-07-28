import * as React from 'react'
import { entityMeta } from './entityMetaProvider'
import { ParagraphProps } from '@/types/paragraph'

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
