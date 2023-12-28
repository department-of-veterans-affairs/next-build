import Link from 'next/link'
import { Button as FormattedButton } from '@/types/formatted/button'

export function Button({ id, label, url }: FormattedButton) {
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
