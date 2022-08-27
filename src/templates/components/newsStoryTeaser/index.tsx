import { MediaImageComponent } from '@/templates/common/media'
import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { NewsStoryTeaserType } from '@/types/index'

/** Teaser news story. */
export const NewsStoryTeaser = ({
  headingLevel,
  title,
  image,
  link,
  introText,
}: NewsStoryTeaserType) => {
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
          <MediaImageComponent {...image} imageStyle="2_1_large" />
        </div>
      </div>
    </>
  )
}
