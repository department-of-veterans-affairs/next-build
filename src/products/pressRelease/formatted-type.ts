import { ComponentType } from 'react'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { FieldAddress } from '@/types/drupal/field_type'
import { Administration } from '@/types/formatted/administration'
import { PressContact } from '@/types/formatted/contactInfo'

export type PressReleaseTeaser = PublishedEntity & {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
  link: string
  introText: string
  releaseDate: string
}

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
