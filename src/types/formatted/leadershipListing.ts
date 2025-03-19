import { PersonProfile } from './personProfile'

export type LeadershipListing = {
  description: string
  introText: string
  lastSaved: string
  leadership: PersonProfile[]
  title: string
}
