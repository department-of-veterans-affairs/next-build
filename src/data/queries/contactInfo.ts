import { QueryParams, QueryFormatter } from 'next-drupal-query'
import { ParagraphContactInformation } from '@/types/drupal/paragraph'
import { ContactInfo } from '@/types/formatted/contactInfo'
import { queries } from '.'

export const params: QueryParams<null> = () => {
  return queries.getParams().addInclude([
    'field_additional_contact', // can be paragraph--phone_number or paragraph--email_contact
    'field_contact_default',
    'field_contact_default.field_office',
    'field_benefit_hub_contacts',
    'field_benefit_hub_contacts.field_support_services', // this is the additional contact info for a Benefit Hub, node--support_service
  ])
}

// paragraph--contact_information is essentially a wrapper paragraph around several other entity references
export const formatter: QueryFormatter<
  ParagraphContactInformation,
  ContactInfo
> = (entity: ParagraphContactInformation) => {
  const additionalContactType = entity.field_additional_contact?.type
  let additionalContact = null

  switch (additionalContactType) {
    case 'paragraph--email_contact':
      additionalContact = {
        email: {
          label: entity.field_additional_contact.field_email_label,
          address: entity.field_additional_contact.field_email_address,
        },
      }
      break
    case 'paragraph--phone_number':
      additionalContact = {
        phone: {
          label: entity.field_additional_contact.field_phone_label,
          number: entity.field_additional_contact.field_phone_number,
          extension: entity.field_additional_contact.field_phone_extension,
        },
      }
      break
  }

  return {
    contactType: entity.field_contact_info_switch,
    defaultContact: {
      title: entity.field_contact_default.title,
      value: entity.field_contact_default.field_phone_number,
      href: entity.field_contact_default.field_link.uri,
    },
    additionalContact,
    benefitHubContacts: queries.formatData(
      'node--support_service',
      entity.field_benefit_hub_contacts?.field_support_services
    ),
  }
}
