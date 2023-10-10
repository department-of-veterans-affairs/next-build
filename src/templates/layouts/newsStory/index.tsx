import { MediaImage } from '@/templates/common/mediaImage'
import { StaffNewsProfile } from '@/templates/components/personProfile'
import { formatDate } from '@/lib/utils/helpers'
import { SocialLinks } from '@/templates/common/socialLinks'
import { StoryListingLink } from '@/templates/components/storyListingLink'
import { NewsStoryType } from '@/types/index'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { LovellExpandedResourceTypeType } from '@/lib/drupal/lovell'

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
  lovellVariant,
  lovellSwitchPath,
}: LovellExpandedResourceTypeType<NewsStoryType>) => {
  return (
    <>
      <div id="content" className="interior">
        <div className="va-l-detail-page va-facility-page">
          <div className="usa-grid usa-grid-full">
            {/* nav here */}
            <div className="usa-width-three-fourths">
              <article className="usa-content">
                {lovellVariant && lovellSwitchPath && (
                  <LovellSwitcher
                    currentVariant={lovellVariant}
                    switchPath={lovellSwitchPath}
                  />
                )}
                <h1>{title}</h1>
                <MediaImage {...image} imageStyle="2_1_large" />
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
                <ContentFooter />
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
