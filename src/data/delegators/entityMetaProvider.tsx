import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { Meta as PersonProfileMeta } from '@/templates/components/personProfile/dataService'
import { Meta as AlertBlockMeta } from '@/templates/components/alert/dataService'
import { Meta as WysiwygMeta } from '@/templates/components/wysiwyg/dataService'
import { Meta as MediaImageMeta } from '@/templates/common/media/dataService'
import { Meta as AudienceTopicsMeta } from '@/templates/components/audienceTopics/dataService'
import { Meta as ButtonMeta } from '@/templates/common/button/dataService'
import { Meta as EmailContactMeta } from '@/templates/components/emailContact/dataService'
import { Meta as StaffProfileMeta } from '@/templates/layouts/staffProfile/dataService'
import { Meta as RichTextCharLimit1000Meta } from '@/templates/components/richTextCharLimit1000/dataService'
import { Meta as QuestionAnswerMeta } from '@/templates/layouts/questionAnswer/dataService'
import { Meta as BenefitsHubLinksMeta } from '@/templates/common/benefitsHubLinks/dataService'

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
    component: any
    dataService: (entity: any, viewMode: string) => object
    params: DrupalJsonApiParams
    additionalNode?: string
    additionalParams?: DrupalJsonApiParams
    collection?: boolean
  }
}

/** Collect all imported node meta information. */
const EntityMetaIn: EntityMetaInfo[] = [
  PersonProfileMeta,
  QuestionAnswerMeta,
  BenefitsHubLinksMeta,
  // blocks
  AlertBlockMeta,
  // paragraphs
  WysiwygMeta,
  StaffProfileMeta,
  RichTextCharLimit1000Meta,
  AudienceTopicsMeta,
  ButtonMeta,
  EmailContactMeta,
  // media
  MediaImageMeta,
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
