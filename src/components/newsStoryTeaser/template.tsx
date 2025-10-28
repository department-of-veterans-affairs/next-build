import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { MediaImage } from '@/components/mediaImage/template'
import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { NewsStoryTeaser as FormattedNewsStoryTeaser } from '@/components/newsStory/formatted-type'

/** Teaser news story. */
export const NewsStoryTeaser = ({
  headingLevel,
  title,
  image,
  link,
  introText,
}: FormattedNewsStoryTeaser) => {
  const TitleTag = ({ children, className }) => {
    const Heading = (headingLevel ? headingLevel : 'h2') as React.ElementType
    return <Heading className={className}>{children}</Heading>
  }

  return (
    <>
      <div className="vads-grid-container vads-u-padding-x--0 vads-u-margin-bottom--3 tablet:vads-u-margin-bottom--4">
        <div className="vads-grid-row">
          <div className="tablet:vads-grid-col-8 tablet:vads-u-padding-right--3">
            <TitleTag className="vads-u-margin-top--0 vads-u-font-size--md tablet:vads-u-font-size--lg tablet:vads-u-margin-bottom--0p5">
              <VaLink href={link} text={title} />
            </TitleTag>
            <p className="vads-u-margin-y--0">
              {truncateWordsOrChar(introText, 60, true)}
            </p>
          </div>
          <div className="tablet:vads-grid-col-4 stories-list vads-u-order--first tablet:vads-u-order--initial vads-u-margin-bottom--2 tablet:vads-u-margin-bottom--0">
            <MediaImage {...image} imageStyle="2_1_large" />
          </div>
        </div>
      </div>
    </>
  )
}
