import { isEmpty } from 'lodash'
import { Button as FormattedButton } from '@/types/formatted/button'

// Used for R&S pages; either a single blue CTA link or multiple
export function SecondaryButtonGroup ({
  buttons
}: FormattedButton[]): JSX.Element {
  if (isEmpty(buttons)) {
    return null
  }

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
          )
        )}
      </ul>
    )
  }

  return (
    <va-link-action
      href={button.url}
      text={button.label}
      type="secondary"
    />
  )
}
