import { PhoneNumber as FormattedPhoneNumber } from '@/types/formatted/phoneNumber'

export interface SeparatedPhoneNumber {
  phoneNumber: string
  extension: string
  processed: boolean
}

export const separateExtension = (
  phoneNumber: string
): SeparatedPhoneNumber | null => {
  if (!phoneNumber) {
    return null
  }

  const phoneRegex =
    /\(?(\d{3})\)?[- ]*(\d{3})[- ]*(\d{4}),?(?: ?x\.? ?(\d*)| ?ext\.? ?(\d*))?(?!([^<]*>)|(((?!<v?a).)*<\/v?a.*>))/i

  const match = phoneRegex.exec(phoneNumber)

  if (!match || !match[1] || !match[2] || !match[3]) {
    // Short number, invalid format, or not a full US number
    return {
      phoneNumber,
      extension: '',
      processed: false,
    }
  }

  const phone = `${match[1]}-${match[2]}-${match[3]}`
  const extension = match[4] || match[5] || ''

  return {
    phoneNumber: phone,
    extension,
    processed: true,
  }
}

/**
 * Component that displays a label plus a phone number (standard, SMS, fax, or TTY).
 * No header included.
 */
export const PhoneNumber = (
  props: FormattedPhoneNumber & {
    className?: string
    testId?: string
  }
) => {
  const { className, extension, label, number, phoneType, testId } = props

  if (!number) {
    return null
  }

  const sms = phoneType === 'sms'
  const tty = phoneType === 'tty'
  const fax = phoneType === 'fax'

  const isRegularPhone = !sms && !tty && !fax
  const labelToDisplay = !tty && label ? label : 'Phone'

  let extensionToDisplay = extension
  let numberToDisplay = number

  // If an extension was not given in the Drupal field,
  // we need to check if it was nested in the phone number field
  if (!extensionToDisplay) {
    const segmentedNumber = separateExtension(number)

    extensionToDisplay = segmentedNumber.extension
    numberToDisplay = segmentedNumber.phoneNumber
  }

  return (
    <p className={className || undefined} data-testid="phone">
      <strong>{`${labelToDisplay}: `}</strong>
      <va-telephone
        contact={numberToDisplay.replace?.(/-/g, '')}
        extension={extensionToDisplay || null}
        message-aria-describedby={isRegularPhone ? label || 'Phone' : undefined}
        not-clickable={fax ? true : undefined}
        sms={sms ? true : undefined}
        tty={tty ? true : undefined}
        data-testid={testId || undefined}
      ></va-telephone>
    </p>
  )
}
