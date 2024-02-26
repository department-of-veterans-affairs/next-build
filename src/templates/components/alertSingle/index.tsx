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
      return nonReusableRef ? <AlertNonReusable {...nonReusableRef} /> : null
    case 'R':
      return blockReference ? <AlertBlock {...blockReference} /> : null
    default:
      return null
  }
}

export default AlertSingle
