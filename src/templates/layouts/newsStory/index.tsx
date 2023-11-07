import { MediaImage } from '@/templates/common/mediaImage'
import { StaffNewsProfile } from '@/templates/components/personProfile'
import { formatDate } from '@/lib/utils/helpers'
import { SocialLinks } from '@/templates/common/socialLinks'
import { StoryListingLink } from '@/templates/components/storyListingLink'
import { NewsStoryType } from '@/types/index'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'

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
}: LovellStaticPropsResource<NewsStoryType>) => {
  const imageClassName = caption
    ? 'vads-u-margin-bottom--1'
    : 'vads-u-margin-bottom--2p5'

  return (
    <>
      <div className="va-l-detail-page va-facility-page">
        <div className="usa-grid usa-grid-full">
          {/* nav here */}
          <div className="usa-width-three-fourths">
            <article className="usa-content">
              <LovellSwitcher
                currentVariant={lovellVariant}
                switchPath={lovellSwitchPath}
              />
              <h1>{title}</h1>
              <MediaImage
                {...image}
                className={imageClassName}
                imageStyle="2_1_large"
              />
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
            <ContentFooter />
          </div>
        </div>
      </div>
    </>
  )
}
