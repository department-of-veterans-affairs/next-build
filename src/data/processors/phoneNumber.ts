import type { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import { FormattingError } from '../errors/formatting'

export type PhoneNumber = {
  extension?: string
  label?: string
  number: string
  type?: string
}

export function processPhoneNumber(
  phoneNumberParagraph: ParagraphPhoneNumber
): PhoneNumber {
  if (!phoneNumberParagraph?.field_phone_number) {
    throw new FormattingError(
      'Phone number paragraph is missing a phone number'
    )
  }

  const {
    field_phone_number,
    field_phone_extension,
    field_phone_number_type,
    field_phone_label,
  } = phoneNumberParagraph
  return {
    number: field_phone_number,
    extension: field_phone_extension,
    type: field_phone_number_type || 'tel',
    label: field_phone_label,
  }
}
