import React from 'react'
import { AlertNonReusable as FormattedAlertNonReusable } from '@/components/alert/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'
import { Alert } from '@/components/alert/template'

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
