import { render, screen } from '@testing-library/react'
import { PhoneNumber, separateExtension } from './template'
import { PhoneNumber as FormattedPhoneNumber } from '@/components/phoneNumber/formatted-type'

describe('PhoneNumber Component', () => {
  const createPhoneData = (
    extension: FormattedPhoneNumber['extension'],
    label: FormattedPhoneNumber['label'],
    number: FormattedPhoneNumber['number'],
    phoneType: FormattedPhoneNumber['phoneType'],
    type = 'paragraph--phone_number',
    id = '1234'
  ): FormattedPhoneNumber => ({
    type,
    id,
    extension,
    label,
    number,
    phoneType,
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

  describe('treatments', () => {
    it('renders as p by default', () => {
      const phone = createPhoneData('', 'Phone', '123-456-7890', 'phone')
      render(<PhoneNumber {...phone} />)

      expect(screen.getByRole('paragraph')).toBeInTheDocument()
    })

    it('renders as h4 when treatment is set to h4', () => {
      const phone = createPhoneData('', 'Phone', '123-456-7890', 'phone')
      render(<PhoneNumber {...phone} treatment="h4" />)

      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument()
    })

    it('renders as h5 when treatment is set to h5', () => {
      const phone = createPhoneData('', 'Phone', '123-456-7890', 'phone')
      render(<PhoneNumber {...phone} treatment="h5" />)

      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument()
    })
  })
})

describe('separatePhoneNumberExtension', () => {
  it('returns null for empty input', () => {
    expect(separateExtension('')).toBeNull()
  })

  it('returns unprocessed if format is invalid', () => {
    const result = separateExtension('555')
    expect(result).toEqual({
      phoneNumber: '555',
      extension: '',
      processed: false,
    })
  })

  describe.each(['x', 'x.', 'ext', 'ext.'])('handles extension', (ext) => {
    it.each(['', ' '])(`'${ext}%s'`, (space) => {
      expect(separateExtension(`123-456-7890${ext}${space}123`)).toEqual({
        phoneNumber: '123-456-7890',
        extension: '123',
        processed: true,
      })
    })
  })
})
