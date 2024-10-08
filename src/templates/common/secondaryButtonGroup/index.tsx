import { Button as FormattedButton } from '@/types/formatted/button'

// Used for R&S pages; either a single blue CTA link or multiple
export const SecondaryButtonGroup = ({
  buttons
}: FormattedButton[]): JSX.Element => {
  console.log('buttons: ', buttons);
  if (buttons?.length > 1) {
    return (
      <ul class="vads-u-margin-y--3 usa-unstyled-list">
        {buttons?.map(button => (
            <li class="vads-u-margin-bottom--2">
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

  const button = buttons[0]

  if (button) {
    return (
      <va-link-action
        href={button.url}
        text={button.label}
        type="secondary"
      />
    )
  }

  return null
}
