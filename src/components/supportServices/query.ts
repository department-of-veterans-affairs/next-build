import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeSupportService } from '@/types/drupal/node'
import { Contact } from '@/components/contactInfo/formatted-type'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

// Define the query params for fetching node--support_service.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_office'])
}

// takes an array of Support Services and returns them for contact info
export const formatter: QueryFormatter<NodeSupportService, Contact> = (
  entity: NodeSupportService
) => {
  if (!entity) return null

  return {
    label: entity.title,
    number: entity.field_phone_number,
    href: entity.field_link.uri,
  }
}
