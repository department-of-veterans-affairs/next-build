import {
  ParagraphProps,
  ParagraphResourceType,
  ParagraphMetaInfo,
} from '@/types/paragraph'

import { isValidData } from '@/utils/helpers'
import Wysiwyg from '@/components/paragraph/wysiwyg'

function RichTextCharLimit1000({ paragraph, className }: ParagraphProps) {
  if (!isValidData(paragraph)) return

  return (
    <div
      data-template="paragraphs/rich_text_char_limit_1000"
      data-entity-id={paragraph.id}
    >
      <Wysiwyg key={paragraph.id} className={className} paragraph={paragraph} />
    </div>
  )
}

export const Meta: ParagraphMetaInfo = {
  resource: ParagraphResourceType.RichTextCharLimit1000,
  component: RichTextCharLimit1000,
}

export default RichTextCharLimit1000
