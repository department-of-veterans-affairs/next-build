import { render, screen } from '@testing-library/react'
import { StoryListing } from '@/templates/layouts/storyListingFull'
import mock_story_listing from './nodeStoryListing.json'
import mock_news_story from './nodeNewsStory.json'

let storyListingProps: StoryListingProps = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  title: 'Stories',
  introText: 'We honor outstanding doctors',
}

describe('<StoryListing> component renders', () => {
  test('with valid data', () => {
    render(<StoryListing {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
  })
})

describe('<StoryListing> component does not render', () => {
  test('without story listings data', () => {
    storyListingProps = null
    render(<StoryListing {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
