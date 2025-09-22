import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { Wysiwyg } from '../wysiwyg/formatted-type'

export interface VamcSystemPoliciesPage extends PublishedEntity {
  introText?: Wysiwyg
  topOfPageContent?: Wysiwyg
  generalVisitationPolicy?: Wysiwyg
  visitationPolicy?: string
  otherPolicies?: string
  bottomOfPageContent?: Wysiwyg
}
