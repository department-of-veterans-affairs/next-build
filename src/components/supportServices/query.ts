import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { NodeSupportService } from '@/types/drupal/node'
import { Contact } from '@/components/contactInfo/formatted-type'
import { SupportService } from './formatted-type'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

// Define the query params for fetching node--support_service.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams().addInclude(['field_office'])
}

// takes a Support Service and returns it formatted for contact info (backwards compatibility)
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

// takes a Support Service and returns it formatted for benefits hub
export const benefitsHubFormatter: QueryFormatter<
  NodeSupportService,
  SupportService
> = (entity: NodeSupportService) => {
  if (!entity) return null

  return {
    type: entity.type,
    id: entity.id,
    title: entity.title,
    number: entity.field_phone_number,
    link: entity.field_link
      ? {
          uri: entity.field_link.uri,
          title: entity.field_link.title || '',
          url: entity.field_link.url || entity.field_link.uri,
        }
      : undefined,
  }
}
