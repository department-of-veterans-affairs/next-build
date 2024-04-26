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

export interface DrupalMediaDocument extends DrupalMedia {
  document: DrupalFile
}

export interface DrupalMediaVideo extends DrupalMedia {
  video: DrupalFile
}
