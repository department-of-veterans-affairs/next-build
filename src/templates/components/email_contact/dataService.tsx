import { ParagraphEmailContact, ParagraphResourceType } from '@/types/data-types/drupal/paragraph'
import { EmailContact, EmailContactProps } from '@/templates/components/email_contact'
import { EntityMetaInfo } from '@/data/delegators/entityMetaProvider'

export const emailContactDataService = function (
  entity: ParagraphEmailContact
): EmailContactProps {
  return {
    id: entity.id,
    label: entity.field_email_label || null,
    address: entity.field_email_address || null,
  }
}

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.EmailContact,
  component: EmailContact,
  dataService: emailContactDataService,
}
