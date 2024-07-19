import { render, screen } from '@testing-library/react'
import { SocialLinks } from '@/templates/common/socialLinks/index'

const socialLinksProps = {
  title: 'We honor outstanding doctors',
  path: '/pittsburgh-health-care/stories/we-honor-outstanding-doctors',
}

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
