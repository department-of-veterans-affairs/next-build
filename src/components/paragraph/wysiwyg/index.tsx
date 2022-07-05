import {
  ParagraphMetaInfo,
  ParagraphProps,
  ParagraphResourceType,
} from '@/types/paragraph'

function isRequestValid(paragraph) {
  return paragraph.field_wysiwyg !== null
}

export function Wysiwyg({ paragraph, className }: ParagraphProps) {
  if (!paragraph || !isRequestValid(paragraph)) return

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
