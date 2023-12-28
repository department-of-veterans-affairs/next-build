import {
  VaAlert,
  VaAlertExpandable,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { Alert } from '@/types/formatted/alert'

export function AlertBlock({ alertType, id, title, content }: Alert) {
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
