import React from 'react'
import { VaAlert } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { Alert as FormattedAlert } from '@/components/alert/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { AlertBlock } from '@/components/alertBlock/template'
import { Paragraph } from '@/components/paragraph/template'

export function Alert(alert: ParagraphComponent<FormattedAlert>) {
  if (!alert) {
    return null
  }

  const { entityId, alertType, heading, blockReference, paragraphs } = alert

  if (blockReference) {
    return <AlertBlock {...blockReference} />
  }

  return (
    <VaAlert
      data-template="paragraphs/alert"
      data-paragraph-type="paragraph--alert"
      data-entity-id={entityId}
      status={alertType}
      class="vads-u-margin-top--3"
    >
      <h2 slot="headline" className="vads-u-font-size--h3">
        {heading}
      </h2>

      {paragraphs?.map((paragraph) => (
        <Paragraph key={paragraph.id || paragraph.entityId} {...paragraph} />
      ))}
    </VaAlert>
  )
}

export default Alert
