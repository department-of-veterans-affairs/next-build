import { ComponentType } from 'react'
import { formatDate, truncateWordsOrChar } from '@/utils/helpers'
/* Types these components implement. */
import { NewsStoryPageProps, NewsStoryTeaserProps } from '@/types/index'
/* Components used within these components. */
import { MediaImageComponent } from '@/components/media'
import { StaffNewsProfile } from '@/components/person_profile'
import { SocialLinks } from '@/components/socialLinks'
import { StoryListingTeaser } from '../story_listing'

export const NewsStoryFull = ({
  title,
  image,
  caption,
  author,
  introText,
  bodyContent,
  date,
  socialLinks,
  listing,
}: NewsStoryPageProps) => {
  return (
    <>
      <div id="content" className="interior">
        <main className="va-l-detail-page va-facility-page">
          <div className="usa-grid usa-grid-full">
            {/* nav here */}
            <div className="usa-width-three-fourths">
              <article className="usa-content">
                <h1>{title}</h1>
                <MediaImageComponent image={image} imageStyle={'2_1_large'} />
                <div className="vads-u-font-size--sm vads-u-margin-bottom--2p5">
                  {caption}
                </div>
                <StaffNewsProfile {...author} />
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
                <StoryListingTeaser path={listing} />
              </article>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

/** Teaser news story. */
export const NewsStoryTeaser = ({
  headingLevel,
  title,
  image,
  link,
  introText,
}: NewsStoryTeaserProps) => {
  const TitleTag = ({ children, className }) => {
    const Heading = headingLevel ? headingLevel : 'h2'
    return <Heading className={className}>{children}</Heading>
  }

  return (
    <>
      <div className="usa-grid usa-grid-full vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4 vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
        <div className="usa-width-two-thirds">
          <TitleTag className="vads-u-font-size--md medium-screen:vads-u-font-size--lg medium-screen:vads-u-margin-bottom--0p5">
            <a href={link}>{title}</a>
          </TitleTag>
          <p className="vads-u-margin-y--0">
            {truncateWordsOrChar(introText, 60, true)}
          </p>
        </div>
        <div className="usa-width-one-third stories-list vads-u-order--first medium-screen:vads-u-order--initial vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
          <MediaImageComponent
            image={image}
            imageStyle={'2_1_medium_thumbnail'}
          />
        </div>
      </div>
    </>
  )
}
