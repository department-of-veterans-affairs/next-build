import { recordEvent } from '@/lib/analytics/recordEvent'
import { StoryListingLink as FormattedStoryListingLink } from '@/types/formatted/storyListing'

export const StoryListingLink = ({ path }: FormattedStoryListingLink) => {
  return (
    <p>
      <va-link
        onClick={() =>
          recordEvent({
            event: 'nav-secondary-button-click',
          })
        }
        class="vads-u-display--block vads-u-margin-bottom--7"
        href={path}
        text="See all stories"
        active
      />
    </p>
  )
}
