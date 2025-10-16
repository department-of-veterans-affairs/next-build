import { FieldLink } from '@/types/drupal/field_type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'

export type VaForm = PublishedEntity & {
  formName: string
  formNumber: string
  formTitle?: string
  numPages?: number
  revisionDate?: string
  issueDate?: string
  formUrl?: FieldLink
  toolUrl?: FieldLink
  toolIntro?: string
  usage?: string
  linkTeasers?: Array<{
    link: FieldLink
    summary?: string
  }>
  relatedForms?: Array<{
    id: string
    formNumber: string
    formName: string
  }>
}
