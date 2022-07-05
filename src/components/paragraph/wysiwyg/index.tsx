import {
  ParagraphProps,
  ParagraphResourceType,
  ParagraphMetaInfo,
} from '@/types/paragraph'
import { isValidData } from '@/utils/helpers'

function Wysiwyg({ paragraph, className }: ParagraphProps) {
  if (!paragraph || !isValidData(paragraph)) return

  function createMarkup() {
    return {
      __html: paragraph.field_wysiwyg?.processed,
    }
  }

  return (
    <div
      key={paragraph.id}
      className={className}
      dangerouslySetInnerHTML={createMarkup()}
    />
  )
}

export const Meta: ParagraphMetaInfo = {
  resource: ParagraphResourceType.Wysiwyg,
  component: Wysiwyg,
}

export default Wysiwyg
