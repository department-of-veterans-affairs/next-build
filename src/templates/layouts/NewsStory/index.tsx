import { MediaImageComponent } from '@/templates/common/media'
import { StaffNewsProfile } from '@/templates/components/personProfile'
import { formatDate } from '@/lib/utils/helpers'
import { SocialLinks } from '@/templates/common/socialLinks'
import { StoryListingLink } from '@/templates/components/storyListingLink'
import { NewsStoryType } from '@/types/index'

export const NewsStory = ({
  title,
  image,
  caption,
  author,
  introText,
  bodyContent,
  date,
  socialLinks,
  listing,
}: NewsStoryType) => {
  return (
    <>
      <div id="content" className="interior">
        <main className="va-l-detail-page va-facility-page">
          <div className="usa-grid usa-grid-full">
            {/* nav here */}
            <div className="usa-width-three-fourths">
              <article className="usa-content">
                <h1>{title}</h1>
                <MediaImageComponent {...image} imageStyle="2_1_large" />
                <div className="vads-u-font-size--sm vads-u-margin-bottom--2p5">
                  {caption}
                </div>
                {author && <StaffNewsProfile {...author} />}
                <div className="created-line vads-u-margin-bottom--2p5">
                  <time dateTime={formatDate(date)}>{formatDate(date)}</time>
                </div>

                <SocialLinks {...socialLinks} />

                <div className="usa-grid usa-grid-full vads-u-margin-bottom--2">
                  <div className="va-introtext">
                    <p>{introText}</p>
                  </div>
                  <div
                    className="full-story"
                    dangerouslySetInnerHTML={{
                      __html: bodyContent,
                    }}
                  />
                </div>
                <StoryListingLink path={listing} />
              </article>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
