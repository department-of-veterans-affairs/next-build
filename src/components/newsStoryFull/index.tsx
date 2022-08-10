import { MediaImageComponent, MediaImageProps } from '@/components/media'
import {
  PersonProfileTeaserProps,
  StaffNewsProfile,
} from '@/components/person_profile'
import { formatDate } from '@/utils/helpers'
import { SocialLinks, SocialLinksProps } from '@/components/socialLinks'
import { StoryListingTeaser } from '../story_listing'
import { stubArray } from 'lodash'

export type NewsStoryProps = {
  title: string
  image: MediaImageProps
  caption: string
  author: PersonProfileTeaserProps | any
  introText: string
  bodyContent: string
  date: string
  socialLinks: SocialLinksProps
  listing: string
}

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
}: NewsStoryProps) => {
  const { styles } = image
  return (
    <>
      <div id="content" className="interior">
        <main className="va-l-detail-page va-facility-page">
          <div className="usa-grid usa-grid-full">
            {/* nav here */}
            <div className="usa-width-three-fourths">
              <article className="usa-content">
                <h1>{title}</h1>
                <MediaImageComponent {...image} imageStyle={styles} />
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
                <StoryListingTeaser path={listing} />
              </article>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
