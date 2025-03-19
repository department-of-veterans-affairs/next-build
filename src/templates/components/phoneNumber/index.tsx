import { PhoneNumber as PhoneNumberType } from '@/types/formatted/phoneNumber'

export function PhoneNumber({
  messageAriaDescribedBy,
  phoneNumber,
  testid,
}: {
  messageAriaDescribedBy?: string
  phoneNumber: PhoneNumberType
  testid?: string
}) {
  const { number, extension, num_type } = phoneNumber
  return (
    <va-telephone
      tty={num_type === 'tty' || undefined}
      sms={num_type === 'sms' || undefined}
      not-clickable={num_type === 'fax' || undefined}
      contact={number}
      extension={extension || undefined}
      data-testid={testid || undefined}
      message-aria-describedby={messageAriaDescribedBy || undefined}
    />
  )
}
