import React from 'react'
import { AlertNonReusable as FormattedAlertNonReusable } from '@/types/formatted/alert'
import { ParagraphComponent } from '@/types/formatted/paragraph'
import { Alert } from '@/templates/components/alert'

export function AlertNonReusable(
  alertNonReusable: ParagraphComponent<FormattedAlertNonReusable>
) {
  const alert = {
    blockReference: null,
    ...alertNonReusable,
  }

  return <Alert {...alert} />
}

export default AlertNonReusable
