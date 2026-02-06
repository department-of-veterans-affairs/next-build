import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { AlertBlock as FormattedAlertBlock } from '@/components/alert/formatted-type'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { Wysiwyg } from '@/components/wysiwyg/template'

export function AlertBlock(alertBlock: FormattedAlertBlock) {
  if (!alertBlock || !Object.keys(alertBlock).length) {
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
          <>
            {/* I want the va-additional-info to still trigger a lazy load of the custom element */}
            <div style={{ display: 'none' }}>
              <va-additional-info
                id={`alert-with-additional-info-${id}`}
                trigger={content.header}
                disable-border="true"
                className="alert-with-additional-info"
              >
                {content.text && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content.text,
                    }}
                  />
                )}
              </va-additional-info>
            </div>
            {/* TODO: Replace this placeholder with actual HTML extracted from va-additional-info shadow DOM */}
            {/* Extract HTML by inspecting shadow DOM in browser DevTools */}
            {/* Only add this if va-additional-info is actually used on the target page */}
            <div className="va-additional-info-static alert-with-additional-info">
              {/* Static HTML from shadow DOM goes here */}
              {/* Preserve the trigger and content structure */}
            </div>
          </>
        )}
      </VaAlert>
    </>
  )
}
