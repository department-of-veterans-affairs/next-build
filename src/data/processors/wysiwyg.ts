import { ParagraphWysiwyg } from '@/types/drupal/paragraph'
import { WysiwygField } from '@/types/formatted/wysiwyg'
import { FormattingError } from '../errors/formatting'
export function processWysiwyg(wysiwygPara: ParagraphWysiwyg): WysiwygField {
  if (!wysiwygPara?.field_wysiwyg) {
    throw new FormattingError('missing')
  }

  const { value } =
    typeof wysiwygPara.field_wysiwyg?.[0].value === 'string'
      ? wysiwygPara.field_wysiwyg[0]
      : wysiwygPara.field_wysiwyg

  return {
    html: value,
  }
}
