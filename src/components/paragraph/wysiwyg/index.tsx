import {
  ParagraphProps,
  ParagraphResourceType,
  ParagraphMetaInfo,
} from '@/types/paragraph'
import { isValidData, drupalToVaPath, phoneLinks } from '@/utils/helpers'

function Wysiwyg({ paragraph, className }: ParagraphProps) {
  if (!isValidData(paragraph)) return

  function createMarkup() {
    const data = [paragraph.field_wysiwyg?.processed]
    const filters = [phoneLinks, drupalToVaPath]
    const filteredData = filters.reduce((d, f) => d.filter(f), data)

    return {
      __html: (filteredData || [filteredData[0]] || '') as string,
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
