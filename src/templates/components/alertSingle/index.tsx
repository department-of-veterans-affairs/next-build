import React from 'react'
import { AlertBlock } from '../alertBlock'
import { AlertNonReusable } from '../alertNonReusable'
import { AlertSingle as FormattedAlertSingle } from '@/types/formatted/alert'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function AlertSingle({
  alertSelection,
  blockReference,
  nonReusableRef,
}: ParagraphComponent<FormattedAlertSingle>) {
  switch (alertSelection) {
    case 'NR':
      return <AlertNonReusable {...nonReusableRef} />
    case 'R':
      return <AlertBlock {...blockReference} />
    default:
      return null
  }
}

export default AlertSingle
