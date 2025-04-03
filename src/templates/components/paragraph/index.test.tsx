import { render, screen } from '@testing-library/react'
import { Wysiwyg } from '@/templates/components/wysiwyg'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'
import { FeaturedContent } from '@/templates/common/featuredContent'
import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'
import { Button } from '@/templates/common/button'
import { Button as FormattedButton } from '@/types/formatted/button'
import { Alert } from '@/templates/components/alert'
import { Alert as FormattedAlert } from '@/types/formatted/alert'
import { AlertBlock } from '@/types/formatted/alert'

describe('Wysiwyg Component', () => {
  const formattedWysiwygData: FormattedWysiwyg = {
    type: 'paragraph--wysiwyg',
    id: '1',
    html: '<p>This is a Wysiwyg component.</p>',
  }

  it('renders correctly with valid props', () => {
    render(<Wysiwyg {...formattedWysiwygData} />)
    expect(screen.getByText('This is a Wysiwyg component.')).toBeInTheDocument()
  })
})

describe('FeaturedContent Component', () => {
  const formattedFeaturedContentData: FormattedFeaturedContent = {
    type: 'paragraph--featured_content',
    id: '2',
    title: 'Featured Content Title',
    description: 'Featured content description.',
    link: {
      id: 'link-1',
      url: '/featured-content-url',
      label: 'Read More',
    },
  }

  it('renders correctly with valid props', () => {
    render(<FeaturedContent {...formattedFeaturedContentData} />)
    expect(screen.getByText('Featured Content Title')).toBeInTheDocument()
    expect(
      screen.getByText('Featured content description.')
    ).toBeInTheDocument()
    // Check for link inside va-link
    const vaLinkElement = screen.getByTestId('featured-content-link')
    expect(vaLinkElement).toBeInTheDocument()
    expect(vaLinkElement).toHaveAttribute('href', '/featured-content-url')
    expect(vaLinkElement).toHaveAttribute('text', 'Read More')
  })
})

describe('Button Component', () => {
  const formattedButtonData: FormattedButton = {
    type: 'paragraph--button',
    id: 'button-1',
    label: 'Click Me',
    url: '/button-url',
  }

  it('renders correctly with valid props', () => {
    render(<Button {...formattedButtonData} />)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })
})

describe('Alert Component', () => {
  const alertBlockData: AlertBlock = {
    alertType: 'info',
    id: 'block-1',
    title: 'Alert Block Title',
    content: {
      type: 'paragraph--wysiwyg',
      id: '4',
      html: '<p>This is an alert block content.</p>',
    },
  }

  const alertData: FormattedAlert = {
    type: 'paragraph--alert',
    id: '5',
    alertType: 'info',
    heading: 'Alert Heading',
    blockReference: alertBlockData,
  }

  it('renders correctly with valid props', () => {
    render(<Alert {...alertData} />)
    const vaAlertEl = document.querySelector('va-alert')
    expect(vaAlertEl).toBeValid()
  })
})
