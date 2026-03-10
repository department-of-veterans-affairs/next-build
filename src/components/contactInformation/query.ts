import { QueryFormatter, QueryParams } from '@/lib/next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { ParagraphContactInformation } from '@/types/drupal/paragraph'
import {
  ContactInformation,
  AdditionalContact,
} from '@/components/contactInformation/formatted-type'
import { queries } from '@/lib/drupal/queries'
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

export const formatter: QueryFormatter<
  ParagraphContactInformation,
  ContactInformation
> = (entity: ParagraphContactInformation) => {
  return {
    type: entity.type as ContactInformation['type'],
    id: entity.id,
    entityId: entity.drupal_internal__id,
    contactType:
      entity.field_contact_info_switch as ContactInformation['contactType'],
    defaultContact: queries.formatData(
      RESOURCE_TYPES.SUPPORT_SERVICES,
      entity.field_contact_default
    ),
    additionalContact: formatParagraph(
      entity.field_additional_contact
    ) as AdditionalContact,
    benefitHubContacts:
      entity.field_benefit_hub_contacts?.field_support_services
        .filter((supportService) => supportService.status)
        .map((supportService) =>
          queries.formatData(RESOURCE_TYPES.SUPPORT_SERVICES, supportService)
        ) ?? null,
  }
}
