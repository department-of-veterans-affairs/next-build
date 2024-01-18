import { render, screen } from '@testing-library/react'
import { SocialLinks } from '@/templates/common/socialLinks/index'

const socialLinksProps = {
  title: 'We honor outstanding doctors',
  path: '/pittsburgh-health-care/stories/we-honor-outstanding-doctors',
}

test('<SocialLinks> component renders standard links', () => {
  render(<SocialLinks {...socialLinksProps} />)

  expect(screen.getByText(/Share on Facebook/)).toHaveAttribute(
    'href',
    'https://www.facebook.com/sharer/sharer.php?href=/pittsburgh-health-care/stories/we-honor-outstanding-doctors'
  )
  expect(screen.getByText(/Share on Twitter/)).toHaveAttribute(
    'href',
    'https://twitter.com/intent/tweet?text=We honor outstanding doctors&url=/pittsburgh-health-care/stories/we-honor-outstanding-doctors'
  )
})

test('<SocialLinks> component renders VBA links', () => {
  const vbaProps = {
    ...socialLinksProps,
    regionNickname: 'Pittsburgh',
    fieldNews: {
      uri: 'https://news-link.com',
      title: 'VBA News',
    },
  }

  render(<SocialLinks {...vbaProps} />)
  const vbaLink = screen.getByText('VBA News').closest('a')
  expect(vbaLink).toHaveAttribute('href', 'https://news-link.com')
})

test('<SocialLinks> renders correct links based on props', () => {
  const eventProps = {
    ...socialLinksProps,
    description: 'Event Description',
    address: 'Event Address',
    dateObject: { endValue: 123, value: 456 },
  }

  render(<SocialLinks {...eventProps} />)

  // Check for event-specific link
  expect(screen.getByText(/Add to Calendar/)).toBeInTheDocument()
})
