import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import * as data from './mock.json'
import { NewsStory, NewsStoryTeaser, Meta } from './'
import { drupalClient } from '@/utils/drupalClient'
import { nock, nockBack } from 'test-utils'
import { NodeMetaInfo, NodeNewsStory, NodeResourceType } from '@/types/node'

nockBack.fixtures = __dirname

const getNewsStories = async () => {
  const options = {
    params: Meta.params.getQueryObject(),
  }
  return drupalClient.getResourceCollection<NodeNewsStory[]>(
    Meta.resource,
    options
  )
}

afterAll(async () => {
  nock.restore()
})

describe('<NewsStory> component renders', () => {
  test('with valid data', async () => {
    const { nockDone, context } = await nockBack('news_story_listing_mock.json')
    const newsStories = await getNewsStories()
    render(<NewsStory node={newsStories[0] as never} viewMode={'full'} />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    nockDone()
  })
})

describe('<NewsStory> component does not render', () => {
  test('with invalid data', () => {
    render(<NewsStory node={null} viewMode={'full'} />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })

  test('when viewmode is not defined', () => {
    render(<NewsStory node={data[0] as never} />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})

describe('<NewsStoryTeaser> component renders', () => {
  test('with valid data', () => {
    const { container } = render(
      <NewsStoryTeaser node={data[0] as never} viewMode={'teaser'} />
    )
    const aEl = container.querySelector('a')
    const titleEl = container.querySelector('h2')

    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        /When a hospital has a host of great doctors, honoring just two every year is challenging./
      )
    ).toBeInTheDocument()

    expect(aEl).toHaveAttribute(
      'href',
      '/pittsburgh-health-care/stories/we-honor-outstanding-doctors'
    )
    expect(titleEl).toBeInTheDocument()
  })

  test('and should truncate into text if more than 60 words', () => {
    const { container } = render(
      <NewsStoryTeaser node={data[1] as never} viewMode={'teaser'} />
    )
    const pEl = container.querySelector('p')

    expect(pEl).toHaveTextContent(
      'When a hospital has a host of great doctors, honoring just two every year is challenging. When a hospital has a host of great doctors, honoring just two every year is challenging. When a hospital has a host of great doctors, honoring just two every year is challenging. When a hospital has a host of great doctors, honoring just two...'
    )
  })

  test('with correct headingLevel', () => {
    const { container } = render(
      <NewsStoryTeaser
        node={data[0] as never}
        viewMode={'teaser'}
        headingLevel={'h1'}
      />
    )
    const titleEl = container.querySelector('h1')

    expect(titleEl).toBeInTheDocument()
  })
})

describe('<NewsStoryTeaser> component does not render', () => {
  test('with invalid data', () => {
    render(<NewsStoryTeaser node={null} viewMode={'teaser'} />)
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
