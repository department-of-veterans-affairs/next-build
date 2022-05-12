import { DrupalMedia, DrupalFile } from 'next-drupal'

export interface MediaImage extends DrupalMedia {
  image: DrupalFile
}
