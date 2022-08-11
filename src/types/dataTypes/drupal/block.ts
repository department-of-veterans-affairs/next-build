import { DrupalBlock } from 'next-drupal'
import { MediaImage } from './media'
import {
  ParagraphExpandableText,
  ParagraphLinkTeaser,
  ParagraphWysiwyg,
} from './paragraph'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

/** Union of all block content types.  */
export type BlockContentTypes = BlockAlert | BlockPromo

/** Block content resource types. */
export const enum BlockContentResourceType {
  Alert = 'block_content--alert',
  Promo = 'block_content--promo',
}

export interface BlockAlert extends DrupalBlock {
  field_alert_title: string
  field_alert_type: string
  field_reusability: string
  field_alert_content: ParagraphExpandableText | ParagraphWysiwyg
}

export interface BlockPromo extends DrupalBlock {
  field_image: MediaImage
  field_promo_link: ParagraphLinkTeaser
}

/** General BlockContentProps to pass blocks into block components. */
export interface BlockContentProps {
  blockContent: BlockContentTypes
  componentParams?
  className?: string
}

/** Each Block component must export a BlockContentMetaInfo object `Meta`. This information helps next-build associate Drupal resource types with information for rendering them.
 *
 * Example, from {@link Alert}:
 * ```
 const params = new DrupalJsonApiParams().addInclude([
 'field_image',
 'field_owner',
 ])

 export const Meta: BlockContentMetaInfo = {
  resource: 'block_content--alert',
  component: Alert,
  params: params,
}
 * ```
 */
export interface BlockContentMetaInfo {
  /** Identifier for a Drupal data object. These are of the form `entity_type--entity_bundle`, for example `block_content--alert`. */
  resource: string
  /** The component responsible for rendering or delegating rendering this data object. */
  component: ({ blockContent, ...props }: BlockContentProps) => JSX.Element
  /** A DrupalJsonApiParams object containing information necessary for the API query for this data object. */
  params?: DrupalJsonApiParams
}

/** This interface enforces that the Block meta information is indexable by type. */
export interface BlockContentMetaOut {
  [resource: string]: {
    component: ({
      blockContent,
      componentParams,
    }: BlockContentProps) => JSX.Element
    params?: DrupalJsonApiParams
  }
}
