import React from 'react'
import { Alert as FormattedAlert } from '@/types/formatted/alert'
import { ParagraphComponent } from '@/types/formatted/paragraph'
import { AlertBlock } from '../alertBlock'
import { Paragraph } from '../paragraph'

export function Alert(alert: ParagraphComponent<FormattedAlert>) {
  if (!alert) {
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
      role="alert"
      uswds="false"
    >
      <h2 slot="headline" className="vads-u-font-size--h3">
        {heading}
      </h2>

      {paragraphs?.map((paragraph) => (
        <Paragraph key={paragraph.id} {...paragraph} />
      ))}
    </va-alert>
  )
}

export default Alert
