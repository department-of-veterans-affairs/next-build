import { render, screen } from '@testing-library/react'
import { AudienceTopics } from './index'
import { AudienceTopics as FormattedAudienceTopics } from '@/types/formatted/audienceTopics'

describe('AudienceTopics with valid data', () => {
  const audienceTopicProps: FormattedAudienceTopics = {
    tags: [
      {
        id: '386eb70d-696c-4af3-8986-306ce63d90de',
        href: '/resources/tag/all-veterans',
        name: 'All Veterans',
        categoryLabel: 'Topics',
      },
      {
        id: '8360523e-a4bb-4d36-851f-1c445501c8bf',
        href: '/resources/tag/payments-and-debt',
        name: 'Payments and debt',
        categoryLabel: 'Audience',
      },
    ],
  }

  test('renders component', () => {
    render(<AudienceTopics {...audienceTopicProps} />)

    // Find the Link elements using their text content
    const link1 = screen.getByText('All Veterans')
    const link2 = screen.getByText('Payments and debt')

    // Assert that the 'href' attributes are correct
    expect(link1).toContainHTML('href="/resources/tag/all-veterans"')
    expect(link2).toContainHTML('href="/resources/tag/payments-and-debt"')

    // Assert that the text content is present in the document
    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).toBeInTheDocument()
  })
})

describe('AudienceTopics without Topics', () => {
  const audienceTopicProps: FormattedAudienceTopics = {
    tags: [
      {
        id: '386eb70d-696c-4af3-8986-306ce63d90de',
        href: '/resources/tag/all-veterans',
        name: 'All Veterans',
        categoryLabel: 'Audience',
      },
    ],
  }

  test('does not render Topics category within component', () => {
    render(<AudienceTopics {...audienceTopicProps} />)

    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).not.toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).toBeInTheDocument()
  })
})

describe('AudienceTopics without Audience', () => {
  const audienceTopicProps: FormattedAudienceTopics = {
    tags: [
      {
        id: '8360523e-a4bb-4d36-851f-1c445501c8bf',
        href: '/resources/tag/payments-and-debt',
        name: 'Payments and debt',
        categoryLabel: 'Topics',
      },
    ],
  }

  test('does not render Audience category within component', () => {
    render(<AudienceTopics {...audienceTopicProps} />)

    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).not.toBeInTheDocument()
  })
})

describe('AudienceTopics without Topics and Audience', () => {
  const audienceTopicProps: FormattedAudienceTopics = {
    tags: [],
  }

  test('does not render the component', () => {
    render(<AudienceTopics {...audienceTopicProps} />)

    expect(screen.queryByText(/Tags/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).not.toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).not.toBeInTheDocument()
  })
})
