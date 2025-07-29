import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { Wysiwyg as FormattedWysiwyg } from './wysiwyg'

export type VbaFacility = PublishedEntity & {
  title: string
  ccVBAFacilityOverview: FormattedWysiwyg
}
