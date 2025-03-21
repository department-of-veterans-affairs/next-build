import { CcTextExpander } from '@/types/drupal/paragraph'
import { textExpander as FormatetedTextExpander } from '@/types/formatted/textExpander'
import { FormattingError } from '../errors/formatting'

export function processCcTermExpander(
  field_cc_term_definitions: CcTextExpander
): FormatetedTextExpander {
  if (
    !field_cc_term_definitions?.fetched ||
    !field_cc_term_definitions.fetched.field_text_expander?.length
  ) {
    throw new FormattingError('CC Term Expander is missing fetched values')
  }
  const { fetched } = field_cc_term_definitions
  return {
    expander: fetched.field_text_expander[0].value,
    html: fetched.field_wysiwyg[0].value,
  }
}
