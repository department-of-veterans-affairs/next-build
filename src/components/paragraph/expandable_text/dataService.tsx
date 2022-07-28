import { EntityMetaInfo } from '@/lib/delegators/entityMetaProvider'
import {
  ParagraphMetaInfo,
  ParagraphProps,
  ParagraphResourceType,
} from '@/types/paragraph'

function isRequestValid(paragraph) {
  return paragraph.field_text_expander !== null
}

export function ExpandableText({ paragraph }: ParagraphProps) {
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

export const Meta: EntityMetaInfo = {
  resource: ParagraphResourceType.ExpandableText,
  component: ExpandableText,
  dataService
}
