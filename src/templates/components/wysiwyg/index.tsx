import { isValidData } from '@/lib/utils/helpers'
import { Html } from '@/types/formatted/html'
import {
  Wysiwyg as FormattedWysiwyg,
  WysiwygField as FormattedWysiwygField,
} from '@/types/formatted/wysiwyg'
import { ParagraphComponent } from '@/types/formatted/paragraph'

function createMarkup(html): Html {
  return {
    __html: html,
  }
}

export function WysiwygField({ className, html }: FormattedWysiwygField) {
  if (!isValidData(html)) return

  return (
    <div
      className={className}
      itemProp="text"
      dangerouslySetInnerHTML={createMarkup(html)}
    ></div>
  )
}

export function Wysiwyg({
  entityId,
  html,
  className = 'processed-content',
}: ParagraphComponent<FormattedWysiwyg>) {
  if (!isValidData(html)) return

  return (
    <div
      data-entity-id={entityId}
      data-template="paragraphs/wysiwyg"
      data-paragraph-type="paragraph--wysiwyg"
      data-next-component="templates/components/wysiwyg"
    >
      <WysiwygField html={html} className={className} />
    </div>
  )
}
