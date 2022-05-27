import * as React from 'react'
import { Meta as NewsStoryMeta } from '@/components/node/news_story'
import { Meta as QaMeta } from '@/components/node/q_a'
import { NodeTypes } from '@/types/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ViewMode } from '@/utils/enums'

/** General NodeProps to pass nodes into node components. */
interface NodeProps {
  node: NodeTypes
  viewMode?: ViewMode
}

/** Each Node component must export a NodeMetaInfo object `Meta`. This information helps next-build associate Drupal resource types with information for rendering them.
 *
 * Example, from {@link NewsStory}:
 * ```
 const params = new DrupalJsonApiParams().addInclude([
    'field_media',
    'field_media.image',
    'field_author',
])

export const Meta: NodeMetaInfo = {
  resource: 'node--news_story',
  component: NewsStory,
  params: params,
}
 * ```
 */
export interface NodeMetaInfo {
  /** Identifier for a Drupal data object. These are of the form `entity_type--entity_bundle`, for example `node--news_story` or `paragraph--email_contact`. */
  resource: string
  /** The component responsible for rendering or delegating rendering this data object. */
  component: ({ node, viewMode, ...props }: NodeProps) => JSX.Element
  /** A DrupalJsonApiParams object containing information necessary for the API query for this data object. */
  params: DrupalJsonApiParams
}

/** Collect all imported node meta information. */
const nodeMetaIn: NodeMetaInfo[] = [NewsStoryMeta, QaMeta]

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
export function Node({ node, viewMode = ViewMode.FULL, ...props }: NodeProps) {
  if (!node) {
    return null
  }

  const Component = nodeMeta[node.type].component

  if (!Component) {
    return null
  }

  return <Component node={node} viewMode={viewMode} {...props} />
}
