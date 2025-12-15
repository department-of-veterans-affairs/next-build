import { FieldAddress } from '@/types/drupal/field_type'

export const addressToString = (address: FieldAddress | null | undefined) => {
  if (!address) return ''

  return [address.address_line1, address.locality, address.administrative_area]
    .filter(Boolean)
    .join(', ')
}
