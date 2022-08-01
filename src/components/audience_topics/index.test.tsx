import { render, screen } from '@testing-library/react'
import { AudienceTopicProp, AudienceTopics } from './index'

describe('AudienceTopics with valid data', () => {
  const audienceTopicProps: AudienceTopicProp = {
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
    const { container } = render(<AudienceTopics {...audienceTopicProps} />)

    const aEl = container.querySelectorAll('a')

    expect(aEl[0]).toHaveAttribute(
      'href',
      '/resources/tag/all-veterans/All%20Veterans'
    )
    expect(aEl[1]).toHaveAttribute(
      'href',
      '/resources/tag/payments-and-debt/Payments%20and%20debt'
    )

    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).toBeInTheDocument()
  })
})

describe('AudienceTopics without Topics', () => {
  const audienceTopicProps: AudienceTopicProp = {
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
  const audienceTopicProps: AudienceTopicProp = {
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
  const audienceTopicProps: AudienceTopicProp = {
    tags: [],
  }

  test('does not render the component', () => {
    render(<AudienceTopics {...audienceTopicProps} />)

    expect(screen.queryByText(/Tags/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Payments and debt/)).not.toBeInTheDocument()
    expect(screen.queryByText(/All Veterans/)).not.toBeInTheDocument()
  })
})
