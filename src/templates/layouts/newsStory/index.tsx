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
        <div className="vads-grid-container">
          {/* nav here */}
          <div className="grid-row">
            <div className="grid-col-12">
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
                {author && (
                  <StaffNewsProfile
                    field_name_first={author.field_name_first}
                    field_last_name={author.field_last_name}
                    field_description={author.field_description}
                  />
                )}
                <p className="vads-u-margin-bottom--2p5">
                  <time dateTime={formatDate(date)}>{formatDate(date)}</time>
                </p>

                <SocialLinks {...socialLinks} />

                <div className="vads-grid-container vads-u-padding-x--0 vads-u-margin-bottom--2">
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
      </div>
    </>
  )
}
