import { isEmpty } from 'lodash'
import {
  BlockContentMetaInfo,
  BlockContentProps,
  BlockContentResourceType,
} from '@/types/block'
import {
  VaAlert,
  VaAlertExpandable,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'

export function Alert({ blockContent }: BlockContentProps) {
  if (isEmpty(blockContent)) return

  const alertType =
    blockContent.field_alert_type === 'information'
      ? 'info'
      : blockContent.field_alert_type

  return (
    <>
      <VaAlert
        id={blockContent.id}
        status={alertType}
        class="vads-u-margin-top--3"
        role="alert"
      >
        <h2 slot="headline" className="vads-u-font-size--h3">
          {blockContent.field_alert_title}
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
            id={blockContent.id}
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

export const Meta: BlockContentMetaInfo = {
  resource: BlockContentResourceType.Alert,
  component: Alert,
}
