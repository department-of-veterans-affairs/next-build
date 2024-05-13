import { PublishedEntity } from './publishedEntity'
import { NodeOffice, NodePersonProfile, NodeEventListing } from '../drupal/node'
import {
  DrupalMediaDocument,
  DrupalMediaImage,
  DrupalMediaVideo,
} from '../drupal/media'
import { FieldAddress, FieldFormattedText } from '../drupal/field_type'
import { Administration } from './administration'
import { PressContact } from './contactInfo'

export type PressReleaseDownload = {
  id: string
  type: string
  name: string
  uri: string
}

export type PressRelease = PublishedEntity & {
  releaseDate: string
  /* ex. '2021-07-01T00:00:00-04:00' */
  pdfVersion: string
  introText: string
  address: FieldAddress
  fullText: string
  /* fieldPressReleaseContact is a reference to a Staff Profile, which is actually a person_profile*/
  contacts: PressContact[]
  downloads: PressReleaseDownload[]
  listing: string
  administration: Administration
}
