// Define the query params for fetching paragraph--email_contact.
import { ParagraphEmailContact } from '@/types/dataTypes/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { EmailContactType } from '@/types/index'

export const formatter: QueryFormatter<ParagraphEmailContact, EmailContactType> = (
  entity: ParagraphEmailContact
) => {
  return {
    id: entity.id,
    label: entity.field_email_label || null,
    address: entity.field_email_address || null,
  }
}
