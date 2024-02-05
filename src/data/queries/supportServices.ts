import { QueryFormatter } from 'next-drupal-query'
import { NodeSupportService } from '@/types/drupal/node'
import { Contact } from '@/types/formatted/contactInfo'

// takes an array of Support Services and returns them for contact info
export const formatter: QueryFormatter<NodeSupportService[], Contact[]> = (
  entities: NodeSupportService[]
) => {
  if (!entities) return null

  return entities.map((entity) => {
    if (entity.status) {
      return {
        title: entity.title,
        value: entity.field_phone_number,
        href: entity.field_link.uri,
      }
    } else {
      return null
    }
  })
}
