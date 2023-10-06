import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { BannerType } from '@/types/index'

export const Banner = ({
  id,
  title,
  body,
  alertType,
  dismiss,
}: BannerType): JSX.Element => {
  return (
    <VaBanner
      id={id}
      role="va-banner"
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
