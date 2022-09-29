import { isValidData } from '@/lib/utils/helpers'
import { WysiwygType, HtmlType } from '@/types/index'

export function Wysiwyg({ id, html, className }: WysiwygType) {
  if (!isValidData(html)) return

  function createMarkup(): HtmlType {
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
