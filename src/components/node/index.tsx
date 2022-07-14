import * as React from 'react'
import { Meta as NewsStoryMeta } from '@/components/node/news_story'
import { Meta as QaMeta } from '@/components/node/q_a'
import { Meta as StoryListingMeta } from '@/components/node/story_listing'
import { Meta as BannerMeta } from '@/components/node/banner'

import { NodeMetaInfo, NodeMetaOut, NodeProps } from '@/types/node'

/** Collect all imported node meta information. */
const nodeMetaIn: NodeMetaInfo[] = [
  NewsStoryMeta,
  QaMeta,
  StoryListingMeta,
  BannerMeta,
]

/** Converts the meta information into a form indexed by resource type. Very possibly overwrought. */
export const nodeMeta: NodeMetaOut = nodeMetaIn.reduce((acc, current) => {
  const {
    resource,
    component,
    params,
    additionalNode,
    additionalParams,
    collection,
  } = current
  acc[resource] = {
    component: component,
    params: params,
    additionalNode: additionalNode,
    collection: collection,
    additionalParams: additionalParams,
  }
  return acc
}, {})

/** Generalized component. Look up the component the data requires and use it to render. */
export function Node({
  node,
  additionalNode,
  viewMode = 'full',
  ...props
}: NodeProps) {
  if (!node) return null

  const type =
    node?.type ||
    node?.map((data) => data.type) ||
    additionalNode?.type ||
    additionalNode?.map((data) => data.type)

  const Component = nodeMeta[type]?.component

  if (!Component) return null

  return (
    <Component
      node={node}
      additionalNode={additionalNode}
      viewMode={viewMode}
      {...props}
    />
  )
}
