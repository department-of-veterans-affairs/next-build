import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { Link } from '../staffProfile/formatted-type'

type Update = {
  dateTime: string
  timezone: string
  updateText: string
}

export type OperatingStatus = {
  title: string
  url: string
  status: FacilityOperatingStatusFlags
  statusInfo: string | null
}

export type SituationUpdates = {
  updates: Update[]
  info: string
}

export type VamcOperatingStatusAndAlerts = PublishedEntity & {
  facilityName: string
  menu?: SideNavMenu
  situationUpdates: SituationUpdates[]
  operatingStatuses: OperatingStatus[]
  emergencyInformation: string
  localEmergencyLinks: Link[]
}
