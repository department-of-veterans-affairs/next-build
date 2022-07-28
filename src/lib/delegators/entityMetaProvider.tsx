import { NodeProps, NodeTypes } from '@/types/node'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import { Meta as NewsStoryMeta } from '@/components/news_story/dataService'
import { Meta as QaMeta } from '@/components/node/q_a'
import { Meta as StoryListingMeta } from '@/components/story_listing/dataService'
import { Meta as BannerMeta } from '@/components/node/banner'
import { Meta as BannerAlertMeta } from '@/components/node/banner_alert'
import { Meta as PersonProfileMeta } from '@/components/person_profile/dataService'
import { Meta as AlertBlockMeta } from '@/components/alert/dataService'
import { Meta as WysiwygMeta } from '@/components/wysiwyg/dataService'
import { Meta as ExpandableTextMeta } from '@/components/expandable_text/dataService'

export interface EntityMetaInfo {
  /** Identifier for a Drupal data object. These are of the form `entity_type--entity_bundle`, for example `node--news_story` or `paragraph--email_contact`. */
  resource: string
  /** The EntityDataService which will process a given entity type for consumption by components. */
  dataService: (entity: any, viewMode: string) => object
  /** The component responsible for rendering or delegating rendering this data object. */
  component: any
  /** A DrupalJsonApiParams object containing information necessary for the API query for this data object. */
  params?: DrupalJsonApiParams
  /** Identifier for an additional Drupal data object. These are of the form `entity_type--entity_bundle`, for example `node--news_story`. */
  additionalNode?: string
  /** Additional DrupalJsonApiParams object containing information necessary for the API query for this data object. */
  additionalParams?: DrupalJsonApiParams
  /** If true, the component will render a collection of nodes. */
  collection?: boolean
}

/** This interface enforces that the Node meta information is indexable by type. */
export interface EntityMetaOut {
  [resource: string]: {
    component: ({ any }) => JSX.Element
    dataService: (entity: any, viewMode: string) => object
    params: DrupalJsonApiParams
    additionalNode?: string
    additionalParams?: DrupalJsonApiParams
    collection?: boolean
  }
}

/** Collect all imported node meta information. */
const EntityMetaIn: EntityMetaInfo[] = [
  // nodes
  NewsStoryMeta,
  PersonProfileMeta,
  StoryListingMeta,
  // blocks
  AlertBlockMeta,
  // paragraphs
  WysiwygMeta,
  ExpandableTextMeta,
]

/** Converts the meta information into a form indexed by resource type. Very possibly overwrought. */
export const entityMeta: EntityMetaOut = EntityMetaIn.reduce((acc, current) => {
  const {
    resource,
    component,
    dataService,
    params,
    additionalNode,
    additionalParams,
    collection,
  } = current
  acc[resource] = {
    component: component,
    dataService: dataService,
    params: params,
    additionalNode: additionalNode,
    collection: collection,
    additionalParams: additionalParams,
  }
  return acc
}, {})
