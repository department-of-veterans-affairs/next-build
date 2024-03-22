import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ParagraphContactInformation } from '@/types/drupal/paragraph'
import { ContactInfo, AdditionalContact } from '@/types/formatted/contactInfo'
import { queries } from '.'
import { formatParagraph } from '@/lib/drupal/paragraphs'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
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
  return {
    type: entity.type as ContactInfo['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    contactType: entity.field_contact_info_switch as ContactInfo['contactType'],
    defaultContact: {
      title: entity.field_contact_default.title,
      value: entity.field_contact_default.field_phone_number,
      href: entity.field_contact_default.field_link.uri,
    },
    additionalContact: formatParagraph(
      entity.field_additional_contact
    ) as AdditionalContact,
    benefitHubContacts: queries.formatData(
      'node--support_service',
      entity.field_benefit_hub_contacts?.field_support_services
    ),
  }
}
