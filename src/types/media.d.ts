import { DrupalMedia, DrupalFile } from 'next-drupal'

export interface MediaImage extends DrupalMedia {
  field_description: string
  image: DrupalFile
}
