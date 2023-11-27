import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { Banner as FormattedBanner } from '@/types/dataTypes/formatted/banners'

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
      role="region"
      showClose={dismiss ? 'perm' : false}
      headline={title}
      type={alertType}
      visible={id ? true : false}
      windowSession={dismiss ? 'dismiss-session' : null}
    >
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </VaBanner>
  )
}
