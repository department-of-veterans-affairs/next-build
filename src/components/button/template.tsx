import Link from 'next/link'
import { Button as FormattedButton } from '@/components/button/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'

export function Button({
  id,
  label,
  url,
}: ParagraphComponent<FormattedButton>) {
  return (
    label &&
    url && (
      <div key={id}>
        <Link href={url} passHref className="vads-c-action-link--blue">
          {label}
        </Link>
      </div>
    )
  )
}
