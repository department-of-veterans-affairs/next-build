import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export interface BannerProps {
  id: string
  title: any
  body: any
  alertType: any
  dismiss: any
}

export const Banner = ({
  id,
  title,
  body,
  alertType,
  dismiss,
}): JSX.Element => {
  return (
    <VaBanner
      id={id}
      role="va-banner"
      showClose={dismiss != 'perm'}
      headline={title}
      type={alertType}
      visible={true}
      windowSession={dismiss == 'dismiss-session'}
    >
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </VaBanner>
  )
}
