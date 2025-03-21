import { render } from '@testing-library/react'
import { PhoneNumber } from '.'
import { PhoneNumber as FormattedPhoneNumber } from '@/types/formatted/phoneNumber'

describe('PhoneNumber Component', () => {
  const createPhoneData = (
    extension,
    label,
    number,
    numberType
  ): FormattedPhoneNumber => ({
    extension,
    label,
    number,
    numberType,
  })

  describe('standard phone numbers', () => {
    test('renders the phone number correctly with given extension', () => {
      const phoneWithExtension = createPhoneData(
        '1234',
        'Phone',
        '123-456-7890',
        'phone'
      )
      const { container } = render(<PhoneNumber {...phoneWithExtension} />)

      expect(container.innerHTML).toContain('Phone: ')
      expect(container.innerHTML).toContain('contact="1234567890"')
      expect(container.innerHTML).toContain('extension="1234"')
      expect(container.innerHTML).toContain('message-aria-describedby="Phone"')
      expect(container.innerHTML).not.toContain('not-clickable')
      expect(container.innerHTML).not.toContain('sms')
      expect(container.innerHTML).not.toContain('tty')
    })

    test('renders the phone number correctly with a nested ext. extension', () => {
      const phoneWithNestedExtension = createPhoneData(
        '',
        'Phone',
        '098-765-4321 ext. 4321',
        'phone'
      )
      const { container } = render(
        <PhoneNumber {...phoneWithNestedExtension} />
      )

      expect(container.innerHTML).toContain('Phone: ')
      expect(container.innerHTML).toContain('contact="0987654321"')
      expect(container.innerHTML).toContain('extension="4321"')
      expect(container.innerHTML).toContain('message-aria-describedby="Phone"')
    })

    test('renders the phone number correctly with a nested x extension', () => {
      const phoneNoDashesNestedExt = createPhoneData(
        '',
        'Phone',
        '5666998784 x87387',
        'phone'
      )
      const { container } = render(<PhoneNumber {...phoneNoDashesNestedExt} />)

      expect(container.innerHTML).toContain('Phone: ')
      expect(container.innerHTML).toContain('contact="5666998784"')
      expect(container.innerHTML).toContain('extension="87387"')
      expect(container.innerHTML).toContain('message-aria-describedby="Phone"')
    })
  })

  describe('SMS numbers', () => {
    test('renders the phone number correctly for an sms number', () => {
      const smsPhone = createPhoneData('', 'SMS', '5877384756', 'sms')
      const { container } = render(<PhoneNumber {...smsPhone} />)

      expect(container.innerHTML).toContain('SMS: ')
      expect(container.innerHTML).toContain('contact="5877384756"')
      expect(container.innerHTML).toContain('sms')
      expect(container.innerHTML).not.toContain('extension')
      expect(container.innerHTML).not.toContain('message-aria-describedby')
      expect(container.innerHTML).not.toContain('not-clickable')
      expect(container.innerHTML).not.toContain('tty')
    })
  })

  describe('fax numbers', () => {
    test('renders the phone number correctly for a fax number', () => {
      const faxPhone = createPhoneData('', 'Fax', '9847627364', 'fax')
      const { container } = render(<PhoneNumber {...faxPhone} />)

      expect(container.innerHTML).toContain('Fax: ')
      expect(container.innerHTML).toContain('contact="9847627364"')
      expect(container.innerHTML).toContain('not-clickable')
      expect(container.innerHTML).not.toContain('extension')
      expect(container.innerHTML).not.toContain('message-aria-describedby')
      expect(container.innerHTML).not.toContain('sms')
      expect(container.innerHTML).not.toContain('tty')
    })
  })

  describe('TTY numbers', () => {
    test('renders the phone number correctly for a tty number', () => {
      const faxPhone = createPhoneData('00023', 'TTY', '2736456752', 'tty')
      const { container } = render(<PhoneNumber {...faxPhone} />)

      expect(container.innerHTML).toContain('Phone: ')
      expect(container.innerHTML).toContain('contact="2736456752"')
      expect(container.innerHTML).toContain('extension="00023"')
      expect(container.innerHTML).toContain('tty')
      expect(container.innerHTML).not.toContain('message-aria-describedby')
      expect(container.innerHTML).not.toContain('not-clickable')
      expect(container.innerHTML).not.toContain('sms')
    })
  })
})
