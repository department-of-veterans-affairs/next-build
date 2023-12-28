import { isValidData } from '@/lib/utils/helpers'
import { Html } from '@/types/formatted/html'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'

export function Wysiwyg({ id, html, className }: FormattedWysiwyg) {
  if (!isValidData(html)) return

  function createMarkup(): Html {
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
