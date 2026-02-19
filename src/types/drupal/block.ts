import { DrupalBlock } from 'next-drupal'
import { DrupalMediaImage } from './media'
import {
  ParagraphButton,
  ParagraphExpandableText,
  ParagraphLinkTeaser,
  ParagraphWysiwyg,
} from './paragraph'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { FieldLink } from './field_type'

/** Union of all block content types.  */
export type BlockContentTypes = BlockAlert | BlockPromo

/** Block content resource types. */
export const enum BlockContentResourceType {
  Alert = 'block_content--alert',
  Promo = 'block_content--promo',
}

export interface BlockAlert extends DrupalBlock {
  type: 'block_content--alert'
  field_alert_title: string
  /** The "severity" of the alert. What are the other options? */
  field_alert_type: 'info' | 'warning' | string
  field_reusability: string
  field_alert_content: ParagraphExpandableText | ParagraphWysiwyg
}

export interface BlockPromo extends DrupalBlock {
  type: 'block_content--promo'
  field_image: DrupalMediaImage
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
  component: ({
    blockContent,
    ...props
  }: BlockContentProps) => React.JSX.Element
  /** A DrupalJsonApiParams object containing information necessary for the API query for this data object. */
  params?: DrupalJsonApiParams
}

/** This interface enforces that the Block meta information is indexable by type. */
export interface BlockContentMetaOut {
  [resource: string]: {
    component: ({
      blockContent,
      componentParams,
    }: BlockContentProps) => React.JSX.Element
    params?: DrupalJsonApiParams
  }
}

export interface BlockBenefitPromo extends DrupalBlock {
  field_promo_headline: string
  field_promo_text: string
  field_promo_cta: ParagraphButton
}
export interface BlockCtaWithLink extends DrupalBlock {
  field_cta_summary_text: string
  field_primary_cta_button_text: string
  field_primary_cta_button_url: FieldLink
  field_related_info_links: FieldLink[]
}
