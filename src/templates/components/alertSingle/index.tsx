import React from 'react'
import { AlertBlock } from '../alert'
import { Alert } from '@/types/formatted/alert'

type AlertSingleProps = {
  alertSelection: string
  blockReference: Alert
  nonReusableRef: Alert
}

export function AlertSingle({
  alertSelection,
  blockReference,
  nonReusableRef,
}: AlertSingleProps) {
  if (!alertSelection) return null

  const alertContent = alertSelection === 'R' ? blockReference : nonReusableRef

  if (!alertContent) return null

  const blockContent: Alert = {
    id: alertContent.id,
    alertType: alertContent.alertType,
    title: alertContent.title,
    content: {
      header: alertContent.content.header,
      text: alertContent.content.text,
    },
  }

  return <AlertBlock {...blockContent} />
}

export default AlertSingle
