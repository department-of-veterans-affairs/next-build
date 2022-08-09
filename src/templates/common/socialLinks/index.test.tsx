import { render, screen } from '@testing-library/react'
import { SocialLinks } from 'templates/common/socialLinks/index'

const socialLinks = {
  title: 'We honor outstanding doctors',
  path: '/pittsburgh-health-care/stories/we-honor-outstanding-doctors',
}

test.skip('<SocialLinks> component renders', () => {
  const { container } = render(<SocialLinks {...socialLinks} />)

  const aEl = container.querySelectorAll('a')
  const iEl = container.querySelectorAll('i')
  expect(aEl[0]).toHaveAttribute(
    'href',
    'https://www.facebook.com/sharer/sharer.php?href=https://dev.cms.va.gov/pittsburgh-health-care/stories/we-honor-outstanding-doctors'
  )
  expect(iEl[0]).toHaveAttribute(
    'class',
    'va-c-social-icon fab fa-facebook vads-u-margin-right--0p5'
  )
  expect(screen.queryByText(/Share on Facebook/)).toBeInTheDocument()

  expect(aEl[1]).toHaveAttribute(
    'href',
    'https://twitter.com/intent/tweet?text=We honor outstanding doctors&url=https://dev.cms.va.gov/pittsburgh-health-care/stories/we-honor-outstanding-doctors'
  )
  expect(iEl[1]).toHaveAttribute(
    'class',
    'va-c-social-icon fab fa-twitter vads-u-margin-right--0p5'
  )
  expect(screen.queryByText(/Share on Twitter/)).toBeInTheDocument()
})
