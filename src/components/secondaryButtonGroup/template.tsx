import { VaLinkAction } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { Button as FormattedButton } from '@/components/button/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'

// Used for R&S pages; either a single blue CTA link or multiple
export const SecondaryButtonGroup = ({
  buttons,
}: {
  buttons: ParagraphComponent<FormattedButton>[]
}): React.JSX.Element => {
  if (buttons.length > 1) {
    return (
      <ul className="vads-u-margin-y--3 usa-unstyled-list">
        {buttons?.map((button, index) => (
          <li key={index} className="vads-u-margin-bottom--2">
            <VaLinkAction
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
      <VaLinkAction href={button.url} text={button.label} type="secondary" />
    )
  }

  return null
}
