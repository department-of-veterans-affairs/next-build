import { ParagraphExpandableText } from '@/types/paragraph'

function isRequestValid(paragraph: ParagraphExpandableText) {
  return paragraph.field_text_expander !== null
}

const ExpandableText = ({ paragraph }): JSX.Element => {
  if (!paragraph || !isRequestValid(paragraph)) return

  return (
    <div
      key={paragraph.id}
      className="form-expanding-group borderless-alert additional-info-container"
    >
      <div className="additional-info-title">
        {paragraph.field_text_expander}
      </div>

      {paragraph.field_wysiwyg && (
        <div className="additional-info-content usa-alert-text" hidden>
          {paragraph.field_wysiwyg?.processed}
        </div>
      )}
    </div>
  )
}

export default ExpandableText
