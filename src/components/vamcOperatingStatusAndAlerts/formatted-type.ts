import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'

type Update = {
  dateTime: string
  timezone: string
  updateText: string
}

export type SituationUpdates = {
  updates: Update[]
  info: string
}

export type VamcOperatingStatusAndAlerts = PublishedEntity & {
  facilityName: string
  menu?: SideNavMenu
  situationUpdates: SituationUpdates[]
}
