// Define the query params for fetching paragraph--email_contact.
import { ParagraphEmailContact } from '@/types/drupal/paragraph'
import { QueryFormatter } from 'next-drupal-query'
import { EmailContact } from '@/types/formatted/contactInfo'

export const formatter: QueryFormatter<ParagraphEmailContact, EmailContact> = (
  entity: ParagraphEmailContact
) => {
  return {
    type: entity.type as EmailContact['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    label: entity.field_email_label || null,
    address: entity.field_email_address || null,
  }
}
