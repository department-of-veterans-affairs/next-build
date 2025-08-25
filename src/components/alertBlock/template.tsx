import {
  VaAlert,
  VaAlertExpandable,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { AlertBlock as FormattedAlertBlock } from '@/types/formatted/alert'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Wysiwyg } from '@/components/wysiwyg/template'

export function AlertBlock(alertBlock: FormattedAlertBlock) {
  if (!alertBlock) {
    return null
  }

  const { alertType, id, title, content } = alertBlock
  return (
    <>
      <VaAlert id={id} status={alertType} class="vads-u-margin-top--3" uswds>
        <h2 slot="headline" className="vads-u-font-size--h3">
          {title}
        </h2>

        {content.type === PARAGRAPH_RESOURCE_TYPES.WYSIWYG && (
          <Wysiwyg {...content} />
        )}

        {content.type === PARAGRAPH_RESOURCE_TYPES.EXPANDABLE_TEXT && (
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
