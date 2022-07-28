import { isEmpty } from 'lodash'
import {
  VaAlert,
  VaAlertExpandable,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export interface AlertBlockProps {
  alertType: string
  id: string
  title: string
  content: any
}

export function AlertBlock({ alertType, id, title, content }: AlertBlockProps) {
  if (isEmpty(content)) return
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

        {isEmpty(blockContent.field_alert_content.field_text_expander) && (
          <div
            dangerouslySetInnerHTML={{
              __html: blockContent.field_alert_content.field_wysiwyg?.processed,
            }}
          />
        )}

        {!isEmpty(blockContent.field_alert_content.field_text_expander) && (
          <VaAlertExpandable
            id={id}
            trigger={blockContent.field_alert_content.field_text_expander}
          >
            {blockContent.field_alert_content.field_wysiwyg && (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    blockContent.field_alert_content.field_wysiwyg?.processed,
                }}
              />
            )}
          </VaAlertExpandable>
        )}
      </VaAlert>
    </>
  )
}
