import * as React from 'react'
import {
  BlockContentMetaInfo,
  BlockContentProps,
  BlockContentMetaOut,
} from '@/types/block'
import { Meta as AlertMeta } from '@/components/block/alert'

/** Collect all imported block meta information. */
const blockContentMetaIn: BlockContentMetaInfo[] = [AlertMeta]

/** Converts the meta information into a form indexed by resource type. */
export const blockContentMeta: BlockContentMetaOut = blockContentMetaIn.reduce(
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

export function BlockContent({
  blockContent,
  componentParams,
  ...props
}: BlockContentProps) {
  if (!blockContent) return null

  const Component = blockContentMeta[blockContent.type].component

  if (!Component) return null

  return (
    <Component
      blockContent={blockContent}
      componentParams={componentParams}
      {...props}
    />
  )
}
