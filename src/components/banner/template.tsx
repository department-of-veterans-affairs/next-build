import { VaBanner } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { Banner as FormattedBanner } from './formatted-type'

export const Banner = ({
  id,
  title,
  body,
  alertType,
  dismiss,
}: FormattedBanner): React.JSX.Element => {
  return (
    <VaBanner
      id={id}
      showClose={dismiss}
      headline={title}
      type={alertType}
      visible={id ? true : false}
      windowSession={dismiss ? 'dismiss-session' : null}
      data-testid="banner"
    >
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </VaBanner>
  )
}
