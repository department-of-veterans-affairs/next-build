import { render, screen } from '@testing-library/react'
import { AlertBlock } from './template'
import { AlertBlock as FormattedAlertBlock } from '@/components/alert/formatted-type'
import { ExpandableText } from '@/components/expandableText/formatted-type'
import { Wysiwyg } from '@/components/wysiwyg/formatted-type'

const expandableText: ExpandableText = {
  id: 'et-1',
  type: 'paragraph--expandable_text',
  header: 'Learn how to sign in',
  text: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
}

const wysiwyg: Wysiwyg = {
  id: 'wysiwyg-1',
  type: 'paragraph--wysiwyg',
  html: "<p>To use this feature, you'll need a Premium <strong>DS Logon</strong> account.</p>",
}

const blockContent: FormattedAlertBlock = {
  id: '6ecdbf96-2a9e-4beb-9d95-d41fced1473b',
  alertType: 'info',
  title: 'Changes based on Blue Water Navy Vietnam Veterans Act of 2019',
  content: null,
}

describe('<Alert> with valid data and with expandable text', () => {
  const blockContentExpandable: FormattedAlertBlock = {
    ...blockContent,
    content: expandableText,
  }

  test('renders info <Alert> component', () => {
    const { container } = render(<AlertBlock {...blockContentExpandable} />)

    const vaAdditionalInfo = container.querySelector('va-additional-info')
    expect(vaAdditionalInfo).toHaveAttribute('trigger', 'Learn how to sign in')
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).toBeInTheDocument()
    const alertEl = container.querySelector('va-alert')
    expect(alertEl).toHaveAttribute('status', 'info')
  })

  test('renders warning <Alert> component', () => {
    blockContentExpandable.alertType = 'warning'
    const { container } = render(<AlertBlock {...blockContentExpandable} />)

    const vaAdditionalInfo = container.querySelector('va-additional-info')
    expect(vaAdditionalInfo).toHaveAttribute('trigger', 'Learn how to sign in')
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/To use this feature, you'll need a Premium/)
    ).toBeInTheDocument()
    const alertEl = container.querySelector('va-alert')
    expect(alertEl).toHaveAttribute('status', 'warning')
  })
})

describe('<Alert> with valid data and wysiwyg', () => {
  const blockContentWysiwyg: FormattedAlertBlock = {
    ...blockContent,
    content: wysiwyg,
  }

  test('renders info <Alert> component', () => {
    const { container } = render(<AlertBlock {...blockContentWysiwyg} />)

    expect(
      container.querySelector('va-additional-info')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    const alertEl = container.querySelector('va-alert')
    expect(alertEl).toHaveAttribute('status', 'info')
  })

  test('renders warning <Alert> component', () => {
    blockContentWysiwyg.alertType = 'warning'
    const { container } = render(<AlertBlock {...blockContentWysiwyg} />)

    expect(
      container.querySelector('va-additional-info')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Changes based on Blue Water Navy Vietnam Veterans Act of 2019/
      )
    ).toBeInTheDocument()
    const alertEl = container.querySelector('va-alert')
    expect(alertEl).toHaveAttribute('status', 'warning')
  })
})
