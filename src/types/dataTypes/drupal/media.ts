import { DrupalMedia, DrupalFile } from 'next-drupal'

/** Media resource types. */
export const enum MediaResourceType {
  Image = 'media--image',
  Document = 'media--document',
}

export interface DrupalMediaImage extends DrupalMedia {
  field_description: string
  image: DrupalFile
}

export interface DrupalMediaDocument extends DrupalMedia {
  field_document: DrupalFile
}
