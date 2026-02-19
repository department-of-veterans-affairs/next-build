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
        <a href={url} className="vads-c-action-link--blue">
          {label}
        </a>
      </div>
    )
  )
}
