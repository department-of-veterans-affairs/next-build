import { isValidData } from '@/utils/helpers'

export interface HtmlProps {
  __html: string
}

export interface WysiwygProps {
  html: string
  id: number
  className?: string
}

const Wysiwyg: React.FC = ({ html, id, className }: WysiwygProps) => {
  if (!isValidData(html)) return

  function createMarkup(): HtmlProps {
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
