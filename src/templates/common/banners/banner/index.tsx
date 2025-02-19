import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { Banner as FormattedBanner } from '@/types/formatted/banners'

export const Banner = ({
  id,
  title,
  body,
  alertType,
  dismiss,
}: FormattedBanner): JSX.Element => {
  return (
    <VaBanner
      id={id}
      showClose={dismiss ? 'perm' : false}
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
