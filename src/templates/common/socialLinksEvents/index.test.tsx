import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SocialLinksEvents } from '@/templates/common/socialLinksEvents' // Adjust the import path based on your project structure

const socialLinksEventsProps = {
  title: 'Event Title',
  path: '/event-path',
  description: 'Event Description',
  address: '123 Event Street, Test City, PA',
  dateObject: {
    endValue: 1765555767,
    value: 1768555767,
  },
}

test('<SocialLinksEvents> component renders', () => {
  const { container } = render(
    <SocialLinksEvents {...socialLinksEventsProps} />
  )

  const aElements = container.querySelectorAll('a')
  const iElements = container.querySelectorAll('i')

  expect(aElements[0]).toHaveAttribute('href', socialLinksEventsProps.path)
  expect(iElements[0]).toHaveAttribute(
    'class',
    'va-c-social-icon fas fa-calendar-check vads-u-margin-right--0p5'
  )
  expect(screen.queryByText(/Add to Calendar/)).toBeInTheDocument()

  expect(aElements[1]).toHaveAttribute(
    'href',
    `https://www.facebook.com/sharer/sharer.php?href=${socialLinksEventsProps.path}`
  )
  expect(iElements[1]).toHaveAttribute(
    'class',
    'va-c-social-icon fab fa-facebook vads-u-margin-right--0p5'
  )
  expect(screen.queryByText(/Share on Facebook/)).toBeInTheDocument()

  expect(aElements[2]).toHaveAttribute(
    'href',
    `https://twitter.com/intent/tweet?text=${socialLinksEventsProps.title}&url=${socialLinksEventsProps.path}`
  )
  expect(iElements[2]).toHaveAttribute(
    'class',
    'va-c-social-icon fab fa-twitter vads-u-margin-right--0p5'
  )
  expect(screen.queryByText(/Share on Twitter/)).toBeInTheDocument()
})
