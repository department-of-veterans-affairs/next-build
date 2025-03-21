import { FormattingError } from '@/data/errors/formatting'
import { FieldFormattedText } from '@/types/drupal/field_type'
import { WysiwygField } from '@/types/formatted/wysiwyg'

export function processWysiwyg({
  field_wysiwyg,
}: {
  field_wysiwyg: FieldFormattedText | FieldFormattedText[]
}): WysiwygField {
  if (!field_wysiwyg) {
    throw new FormattingError('missing')
  }

  const { value } =
    typeof field_wysiwyg?.[0].value === 'string'
      ? (field_wysiwyg[0] as FieldFormattedText)
      : (field_wysiwyg as FieldFormattedText)

  return {
    html: value,
  }
}
