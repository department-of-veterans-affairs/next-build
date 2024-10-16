import Link from 'next/link'
import { Button as FormattedButton } from '@/types/formatted/button'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function Button({
  id,
  label,
  url,
}: ParagraphComponent<FormattedButton>) {
  return (
    label &&
    url && (
      <div key={id} data-next-component="templates/common/button">
        <Link href={url} passHref className="vads-c-action-link--blue">
          {label}
        </Link>
      </div>
    )
  )
}
