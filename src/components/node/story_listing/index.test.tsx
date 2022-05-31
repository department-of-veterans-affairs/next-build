import { render, screen } from '@testing-library/react'
import StoryListing from '@/components/node/story_listing'
import * as mock_story_listing from './nodeStoryListing.json'
import * as mock_news_story from './nodeNewsStory.json'

describe('<StoryListing> component renders', () => {
  test('with valid data', () => {
    // render(
    //   <StoryListing
    //     nodeStoryListings={mock_story_listing}
    //     nodeNewsStoryTeasers={mock_news_story}
    //   />
    // )
    // expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    // expect(
    //   screen.queryByText(/Read about our VA Pittsburgh health care community./)
    // ).toBeInTheDocument()
    // expect(
    //   screen.queryByText(/Grand opening held for relocated Belmont Clinic/)
    // ).toBeInTheDocument()
  })
})
