import { PublishedEntity } from '@/types/formatted/publishedEntity'

export interface VamcSystemPoliciesPage extends PublishedEntity {
  introText?: string
  topOfPageContent?: string
  generalVisitationPolicy?: string
  visitationPolicy?: string
  otherPolicies?: string
  bottomOfPageContent?: string
}
