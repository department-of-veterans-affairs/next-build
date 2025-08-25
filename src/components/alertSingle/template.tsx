import React from 'react'
import { AlertBlock } from '@/components/alertBlock/template'
import { AlertNonReusable } from '@/components/alertNonReusable/template'
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
