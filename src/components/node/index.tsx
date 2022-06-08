import * as React from 'react'
import { Meta as NewsStoryMeta } from '@/components/node/news_story'
import { Meta as QaMeta } from '@/components/node/q_a'
import { Meta as StoryListingMeta } from '@/components/node/story_listing'
import { NodeTypes } from '@/types/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** General NodeProps to pass nodes into node components. */
interface NodeProps {
  node: NodeTypes
  additionalNode?: NodeTypes
  collection?: boolean
  additionalParams?: DrupalJsonApiParams
  viewMode?: string
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
  collection: true, // optional -  If true, the component will be rendered as a collection of nodes.
  additionalNode: 'node--news_story', // optional - If the component is rendered as a collection, this is the name of the resource to query for additional nodes.
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
  /** Identifier for an additional Drupal data object. These are of the form `entity_type--entity_bundle`, for example `node--news_story`. */
  additionalNode?: string
  /** Additional DrupalJsonApiParams object containing information necessary for the API query for this data object. */
  additionalParams?: DrupalJsonApiParams
  /** If true, the component will render a collection of nodes. */
  collection?: boolean
}

/** Collect all imported node meta information. */
const nodeMetaIn: NodeMetaInfo[] = [NewsStoryMeta, QaMeta, StoryListingMeta]

/** This interface enforces that the Node meta information is indexable by type. */
interface NodeMetaOut {
  [resource: string]: {
    component: ({ node }: NodeProps) => JSX.Element
    params: DrupalJsonApiParams
    additionalNode?: string
    additionalParams?: DrupalJsonApiParams
    collection?: boolean
  }
}

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
