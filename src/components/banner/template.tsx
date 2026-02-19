'use client'
// Note that right now `<VaBanner>` is an old class component, which needs to be wrapped in a client component.

import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
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
