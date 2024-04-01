import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ParagraphContactInformation } from '@/types/drupal/paragraph'
import { ContactInfo, AdditionalContact } from '@/types/formatted/contactInfo'
import { queries } from '.'
import { formatParagraph } from '@/lib/drupal/paragraphs'
import { getNestedIncludes } from '@/lib/utils/queries'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude([
    'field_additional_contact',
    ...getNestedIncludes(
      'field_contact_default',
      RESOURCE_TYPES.SUPPORT_SERVICES
    ),
    ...getNestedIncludes(
      'field_benefit_hub_contacts',
      RESOURCE_TYPES.BENEFITS_HUB
    ),
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
    defaultContact: queries.formatData(
      RESOURCE_TYPES.SUPPORT_SERVICES,
      entity.field_contact_default
    ),
    additionalContact: formatParagraph(
      entity.field_additional_contact
    ) as AdditionalContact,

    //TODO:
    // This should likely be: `queries.formatData(RESOURCE_TYPES.BENEFITS_HUB, entity.field_benefit_hub_contacts)
    // since `entity.field_benefit_hub_contacts` will be a reference to a Benefits Hub Landing Page,
    // but the formatter for Benefits Hub Landing Pages is currently just a "partial"/"teaser" formatter
    // that doesn't include everything we'd need. That likely needs to be broken into  "full" and "teaser"
    // files so we have a formatter for each.
    //
    // For now, we can drill down into `field_support_services` and pass that to the formatter for
    // RESOURCE_TYPES.SUPPORT_SERVICE.
    benefitHubContacts:
      entity.field_benefit_hub_contacts?.field_support_services
        .filter((supportService) => supportService.status)
        .map((supportService) =>
          queries.formatData(RESOURCE_TYPES.SUPPORT_SERVICES, supportService)
        ) || null,
  }
}
