import {
  ParagraphProps,
  ParagraphResourceType,
  ParagraphMetaInfo,
  ParagraphWysiwyg,
} from '@/types/paragraph'
import { isValidData, drupalToVaPath, phoneLinks } from '@/utils/helpers'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface WysiwygPageProps extends ParagraphWysiwyg {
  dangerouslySetInnerHTML: {
    __html:
      | DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
      | string
  }
}

const Wysiwyg: React.FC<ParagraphProps> = ({ paragraph, className }) => {
  if (!isValidData(paragraph)) return

  function createMarkup(): WysiwygPageProps[
    | 'dangerouslySetInnerHTML'
    | '__html'] {
    const data = [paragraph?.field_wysiwyg?.processed]
    const filters = [phoneLinks, drupalToVaPath]
    const filteredData = filters.reduce((d, f) => d.filter(f), data)

    return {
      __html: filteredData || filteredData[0] || '',
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

export default Wysiwyg

export const Meta: ParagraphMetaInfo = {
  resource: ParagraphResourceType.Wysiwyg,
  component: Wysiwyg,
}
