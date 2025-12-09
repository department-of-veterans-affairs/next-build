import { Alert as FormattedAlert } from '@/components/alert/formatted-type'
import { FieldLink } from '@/types/drupal/field_type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { LinkTeaser } from '../linkTeaser/formatted-type'

export type VaForm = PublishedEntity & {
  formName: string
  formNumber: string
  formTitle?: string
  formLanguage: string | null
  revisionDate?: string
  issueDate?: string
  formType?: 'benefit' | 'employment' | 'non-va' | string
  benefitCategories?: string[]
  administration?: string
  /** The formatted alert. Named like this because `alert` is a reserved keyword. */
  alertBlock: FormattedAlert
  formUrl?: FieldLink
  toolUrl?: FieldLink
  toolIntro?: string
  usage?: string
  linkTeasers?: LinkTeaser[]
  relatedForms?: Array<{
    id: string
    formNumber: string | null
    formName: string | null
  }>
}
