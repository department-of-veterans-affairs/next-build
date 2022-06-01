import * as React from 'react'
import { Meta as NewsStoryMeta } from '@/components/node/news_story'
import { Meta as QaMeta } from '@/components/node/q_a'
import { Meta as StoryListingMeta } from '@/components/node/story_listing'
import { NodeTypes } from '@/types/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** General NodeProps to pass nodes into node components. */
interface NodeProps {
  node: NodeTypes
  additional?: NodeTypes
  collection?: boolean
  extra?: DrupalJsonApiParams
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

  additional?: string

  extra?: DrupalJsonApiParams

  collection?: boolean
}

/** Collect all imported node meta information. */
const nodeMetaIn: NodeMetaInfo[] = [NewsStoryMeta, QaMeta, StoryListingMeta]

/** This interface enforces that the Node meta information is indexable by type. */
interface NodeMetaOut {
  [resource: string]: {
    component: ({ node }: NodeProps) => JSX.Element
    params: DrupalJsonApiParams
    additional?: string
    extra?: DrupalJsonApiParams
    collection?: boolean
  }
}

/** Converts the meta information into a form indexed by resource type. Very possibly overwrought. */
export const nodeMeta: NodeMetaOut = nodeMetaIn.reduce((acc, current) => {
  const { resource, component, params, additional, extra, collection } = current
  acc[resource] = {
    component: component,
    params: params,
    additional: additional,
    collection: collection,
    extra: extra,
  }
  return acc
}, {})

/** Generalized component. Look up the component the data requires and use it to render. */
export function Node({
  node,
  additional,
  viewMode = 'full',
  ...props
}: NodeProps) {
  if (!node) {
    return null
  }
  const type =
    node?.type ||
    node?.map((data) => data.type) ||
    additional?.type ||
    additional?.map((data) => data.type)

  const Component = nodeMeta[type]?.component

  if (!Component) {
    return null
  }

  return (
    <Component
      node={node}
      additional={additional}
      viewMode={viewMode}
      {...props}
    />
  )
}
