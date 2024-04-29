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

interface UpdatedDrupalFile extends Omit<DrupalFile, 'drupal_internal__fid'| 'drupal_internal__mid'> {
  drupal_internal__fid: number
  drupal_internal__mid?: number
}

export interface DrupalMediaDocument extends DrupalMedia {
  field_document: UpdatedDrupalFile
}

export interface DrupalMediaVideo extends DrupalMedia {
  video: DrupalFile
}
