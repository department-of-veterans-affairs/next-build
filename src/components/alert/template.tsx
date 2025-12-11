import React from 'react'
import { Alert as FormattedAlert } from '@/components/alert/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { AlertBlock } from '@/components/alertBlock/template'
import { Paragraph } from '@/components/paragraph/template'

export function Alert(alert: ParagraphComponent<FormattedAlert>) {
  // Checking for empty object because this component expects spread props like
  // <Alert {...alert} /> so the `alert` param will always be at least `{}`.
  if (!alert || !Object.keys(alert).length) {
    return null
  }

  const { entityId, alertType, heading, blockReference, paragraphs } = alert

  if (blockReference) {
    return <AlertBlock {...blockReference} />
  }

  return (
    <va-alert
      data-template="paragraphs/alert"
      data-paragraph-type="paragraph--alert"
      data-entity-id={entityId}
      status={alertType}
      class="vads-u-margin-top--3"
      uswds
    >
      <h2 slot="headline" className="vads-u-font-size--h3">
        {heading}
      </h2>

      {paragraphs?.map((paragraph) => (
        <Paragraph key={paragraph.id || paragraph.entityId} {...paragraph} />
      ))}
    </va-alert>
  )
}

export default Alert
