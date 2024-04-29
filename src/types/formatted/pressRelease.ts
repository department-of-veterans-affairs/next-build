import { PublishedEntity } from './publishedEntity'
import { NodeOffice, NodePersonProfile, NodeEventListing } from '../drupal/node'
import { DrupalMediaDocument, DrupalMediaImage, DrupalMediaVideo } from '../drupal/media'
import { FieldAddress, FieldFormattedText } from '../drupal/field_type'

export type PressRelease = PublishedEntity & {
  releaseDate: string
  /* ex. '2021-07-01T00:00:00-04:00' */
  pdfVersion: DrupalMediaDocument
  introText: string
  address: FieldAddress
  fullText: FieldFormattedText
  /* fieldPressReleaseContact is a reference to a Staff Profile, which is actually a person_profile*/
  contacts: NodePersonProfile[]
  downloads: (DrupalMediaImage | DrupalMediaDocument | DrupalMediaVideo)[]
  /*listing: NodeEventListing
     - Currently does not exist yet*/
}
