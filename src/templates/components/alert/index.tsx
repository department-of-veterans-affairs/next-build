import {
  VaAlert,
  VaAlertExpandable,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export interface AlertBlockProps {
  alertType: string
  id: string
  title: string
  content: {
    header?: string
    text: string
  }
}

export function AlertBlock({ alertType, id, title, content }: AlertBlockProps) {
  return (
    <>
      <VaAlert
        id={id}
        status={alertType}
        class="vads-u-margin-top--3"
        role="alert"
      >
        <h2 slot="headline" className="vads-u-font-size--h3">
          {title}
        </h2>

        {!content.header && (
          <div
            dangerouslySetInnerHTML={{
              __html: content.text,
            }}
          />
        )}

        {content.header && (
          <VaAlertExpandable id={id} trigger={content.header}>
            {content.text && (
              <div
                dangerouslySetInnerHTML={{
                  __html: content.text,
                }}
              />
            )}
          </VaAlertExpandable>
        )}
      </VaAlert>
    </>
  )
}
