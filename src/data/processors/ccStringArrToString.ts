import { CCString } from '@/types/drupal/field_type'
import { FormattingError } from '../errors/formatting'

export function ccStringArrToString(arr: CCString[]): string {
  if (!arr.every((item) => item.value)) {
    throw new FormattingError('ccStringArrToString: value missing')
  }
  return arr[0].value
}
