import { render, screen } from '@testing-library/react'
import { StoryListing } from '@/components/story_listing'
import mock_story_listing from './nodeStoryListing.json'
import mock_news_story from './nodeNewsStory.json'

describe('<StoryListing> component renders', () => {
  test('with valid data', () => {
    render(
      <StoryListing
        node={mock_story_listing}
        additionalNode={mock_news_story}
      />
    )
    expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Grand opening held for relocated Belmont Clinic/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/I CARE Award winners recognized/)
    ).toBeInTheDocument()
  })
})

describe('<StoryListing> component does not render', () => {
  test('without story listings data', () => {
    render(<StoryListing node={[]} additionalNode={mock_news_story} />)
    expect(screen.queryByText(/Stories/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Grand opening held for relocated Belmont Clinic/)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/I CARE Award winners recognized/)
    ).not.toBeInTheDocument()
  })
})
