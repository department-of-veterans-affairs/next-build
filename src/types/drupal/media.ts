import { DrupalMedia, DrupalFile } from 'next-drupal'

/** Media resource types. */
export const enum MediaResourceType {
  Image = 'media--image',
  Document = 'media--document',
  Video = 'media--video',
}

export interface DrupalMediaImage extends DrupalMedia {
  field_description: string
  image: DrupalFile
}
/** There is an underlying bug in next-drupal types. Some are being sent as strings and others as numbers
/* causing type conflicts */
interface UpdatedDrupalFile extends Omit<DrupalFile, 'drupal_internal__fid'| 'drupal_internal__mid'> {
  drupal_internal__fid: number

}

export interface DrupalMediaDocument extends Omit<DrupalMedia, 'drupal_internal__mid'> {
  drupal_internal__mid: number
  field_document: UpdatedDrupalFile
}

export interface DrupalMediaVideo extends DrupalMedia {
  video: DrupalFile
}
