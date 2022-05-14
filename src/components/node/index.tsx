import { Meta as NewsStoryMeta } from '@/components/node/news_story'
import { NodeTypes } from '@/types/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** General NodeProps to pass nodes into node components. */
export interface NodeProps {
  node: NodeTypes
  viewMode?: string
}

/** We expect each Node component to define and export information about itself to help with discoverability. */
export interface NodeMetaInfo {
  resource: string
  component: ({ node }: NodeProps) => JSX.Element
  params: DrupalJsonApiParams
}

/** Collect all imported node meta information. */
const nodeMetaIn: NodeMetaInfo[] = [NewsStoryMeta]

/** This interface enforces that the Node meta information is indexable by type. */
interface NodeMetaOut {
  [resource: string]: {
    component: ({ node }: NodeProps) => JSX.Element
    params: DrupalJsonApiParams
  }
}

/** Converts the meta information into a form indexed by resource type. Very possibly overwrought. */
export const nodeMeta: NodeMetaOut = nodeMetaIn.reduce((acc, current) => {
  const { resource, component, params } = current
  acc[resource] = {
    component: component,
    params: params,
  }
  return acc
}, {})

/** Generalized component. Look up the component the data requires and use it to render. */
export function Node({ node, viewMode = 'full', ...props }: NodeProps) {
  if (!node) {
    return null
  }

  const Component = nodeMeta[node.type].component

  if (!Component) {
    return null
  }

  return <Component node={node} viewMode={viewMode} {...props} />
}
