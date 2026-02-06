import { isEmpty } from 'lodash'
import { ExpandableText as FormattedExpandableText } from '@/components/expandableText/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'

export function ExpandableText({
  id,
  header,
  text,
}: ParagraphComponent<FormattedExpandableText>) {
  if (isEmpty(header)) return

  return (
    <>
      {/* I want the va-additional-info to still trigger a lazy load of the custom element */}
      <div style={{ display: 'none' }}>
        <va-additional-info disable-border uswds trigger={header}>
          {text && (
            <div
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            />
          )}
        </va-additional-info>
      </div>
      {/* TODO: Replace this placeholder with actual HTML extracted from va-additional-info shadow DOM */}
      {/* Extract HTML by inspecting shadow DOM in browser DevTools */}
      {/* Only add this if va-additional-info is actually used on the target page */}
      <div className="va-additional-info-static">
        {/* Static HTML from shadow DOM goes here */}
        {/* Preserve the trigger={header} and text content */}
      </div>
    </>
  )
}
