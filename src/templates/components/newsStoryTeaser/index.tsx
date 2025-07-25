import { MediaImage } from '@/templates/common/mediaImage'
import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { NewsStoryTeaser as FormattedNewsStoryTeaser } from '@/products/newsStory/formatted-type'
import { TextWithImage } from '@/templates/components/textWithImage'

/** Teaser news story. */
export const NewsStoryTeaser = ({
  headingLevel,
  title,
  image,
  link,
  introText,
}: FormattedNewsStoryTeaser) => {
  const TitleTag = ({ children, className }) => {
    const Heading = headingLevel ? headingLevel : 'h2'
    return <Heading className={className}>{children}</Heading>
  }

  return (
    <TextWithImage
      className="vads-u-margin-bottom--3 tablet:vads-u-margin-bottom--4"
      image={<MediaImage {...image} imageStyle="2_1_large" />}
      imageClassName="stories-list"
    >
      <TitleTag className="vads-u-margin-top--0 vads-u-font-size--md tablet:vads-u-font-size--lg tablet:vads-u-margin-bottom--0p5">
        <va-link href={link} text={title} />
      </TitleTag>
      <p className="vads-u-margin-y--0">
        {truncateWordsOrChar(introText, 60, true)}
      </p>
    </TextWithImage>
  )
}
