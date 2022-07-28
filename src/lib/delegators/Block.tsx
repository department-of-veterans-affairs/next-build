import * as React from 'react'
import { BlockContentProps } from '@/types/block'
import { entityMeta } from './entityMetaProvider'

export function BlockContent({
  blockContent,
  componentParams,
  ...props
}: BlockContentProps) {
  if (!blockContent) return null

  const Component = entityMeta[blockContent.type].component

  if (!Component) return null

  return (
    <Component
      blockContent={blockContent}
      componentParams={componentParams}
      {...props}
    />
  )
}
