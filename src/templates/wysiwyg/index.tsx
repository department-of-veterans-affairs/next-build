import { isValidData } from '@/lib/utils/helpers'

export interface HtmlProps {
  __html: string
}

export interface WysiwygProps {
  id: string
  html: string
  className?: string
}

export function Wysiwyg({ id, html, className }: WysiwygProps) {
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
