import * as React from 'react'
import { NodeProps } from '@/types/data-types/drupal/node'
import { entityMeta } from 'data/delegators/entityMetaProvider'

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

  const Component = entityMeta[type]?.component

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
