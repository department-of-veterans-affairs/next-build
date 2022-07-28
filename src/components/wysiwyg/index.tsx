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

export interface WysiwygProps {
  html:
    | DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    | string
  id: number
  className?: string
}

const Wysiwyg: React.FC = ({ html, id, className }: WysiwygProps) => {
  if (!isValidData(html)) return

  function createMarkup(): WysiwygPageProps[
    | 'dangerouslySetInnerHTML'
    | '__html'] {
    return {
      __html: html,
    }
  }

  return (
    <div
      key={id}
      className={className}
      dangerouslySetInnerHTML={createMarkup()}
    />
  )
}

export default Wysiwyg
