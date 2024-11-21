import { Button as FormattedButton } from '@/types/formatted/button'
import { ParagraphComponent } from '@/types/formatted/paragraph'

// Used for R&S pages; either a single blue CTA link or multiple
export const SecondaryButtonGroup = ({
  buttons,
}: {
  buttons: ParagraphComponent<FormattedButton>[]
}): JSX.Element => {
  if (buttons.length > 1) {
    return (
      <ul className="vads-u-margin-y--3 usa-unstyled-list">
        {buttons?.map((button, index) => (
          <li key={index} className="vads-u-margin-bottom--2">
            <va-link-action
              href={button.url}
              text={button.label}
              type="secondary"
            />
          </li>
        ))}
      </ul>
    )
  }

  const button = buttons[0]

  if (button) {
    return (
      <va-link-action href={button.url} text={button.label} type="secondary" />
    )
  }

  return null
}
