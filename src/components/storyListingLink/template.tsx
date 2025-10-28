import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { recordEvent } from '@/lib/analytics/recordEvent'
import { StoryListingLink as FormattedStoryListingLink } from '@/components/storyListing/formatted-type'

export const StoryListingLink = ({ path }: FormattedStoryListingLink) => {
  return (
    <p>
      <VaLink
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
