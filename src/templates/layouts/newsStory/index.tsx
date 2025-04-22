import { MediaImage } from '@/templates/common/mediaImage'
import { StaffNewsProfile } from '@/templates/components/staffNewsProfile'
import { formatDate } from '@/lib/utils/helpers'
import { SocialLinks } from '@/templates/common/socialLinks'
import { StoryListingLink } from '@/templates/components/storyListingLink'
import { NewsStory as FormattedNewsStory } from '@/types/formatted/newsStory'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { ContentFooter } from '@/templates/common/contentFooter'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'

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
}: LovellStaticPropsResource<FormattedNewsStory>) => {
  const hasValidImage = image?.links?.['2_1_large']?.href
  const imageClassName =
    caption && hasValidImage
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
              {hasValidImage && (
                <MediaImage
                  {...image}
                  className={imageClassName}
                  imageStyle="2_1_large"
                />
              )}
              {caption && hasValidImage && (
                <div className="vads-u-font-size--sm vads-u-margin-bottom--2p5">
                  {caption}
                </div>
              )}
              {author && <StaffNewsProfile {...author} />}
              <p className="vads-u-margin-bottom--2p5">
                <time dateTime={formatDate(date)}>{formatDate(date)}</time>
              </p>

              <SocialLinks {...socialLinks} />

              <div className="usa-grid usa-grid-full vads-u-margin-bottom--2">
                <div className="va-introtext">
                  <p>{introText}</p>
                </div>
                <div
                  className=""
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
