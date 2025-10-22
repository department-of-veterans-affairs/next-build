import { WysiwygField } from '@/components/wysiwyg/template'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { SpanishTranslationSummary as FormattedSpanishTranslationSummary } from './formatted-type'

/**
 * Note that while this paragraph type is named for Spanish translation, in practice it
 * is used for "additional information" buttons will expand the section to show
 * additional content.
 */
export const SpanishTranslationSummary = ({
  id,
  entityId,
  html,
  textExpander,
}: ParagraphComponent<FormattedSpanishTranslationSummary>) => {
  // There's an `additional-info.js` script in the site-wide scripts that will look for
  // the `additional-info-*` classes and dynamically add toggle functionality.
  return (
    <div
      data-template="paragraphs/spanish_translation"
      data-entity-id={entityId ?? id}
      className="form-expanding-group additional-info-container"
    >
      <span className="additional-info-title">{textExpander}</span>
      <span id={`spanishhelptext-${entityId ?? id}`}>
        <div className="additional-info-content">
          <WysiwygField html={html} />
        </div>
      </span>
    </div>
  )
}
