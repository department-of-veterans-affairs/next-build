import { VaBanner } from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export interface BannerProps {
  id: string
  title: string
  body: string
  alertType: string
  dismiss: boolean
  type: string
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
      visible={id ? true : false}
      windowSession={dismiss == 'dismiss-session'}
    >
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </VaBanner>
  )
}
