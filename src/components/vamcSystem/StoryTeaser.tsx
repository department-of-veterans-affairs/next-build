import { MediaImage } from '@/components/mediaImage/template'
import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { NewsStoryTeaser as FormattedNewsStoryTeaser } from '../newsStory/formatted-type'
import { TextWithImage } from '@/components/textWithImage/template'

/** Story teaser component converted from news_story.drupal.liquid */
export const StoryTeaser = ({
  title,
  link,
  image,
  introText,
}: FormattedNewsStoryTeaser) => (
  <TextWithImage
    data-template="teasers/news_story"
    className="vads-u-margin-bottom--3 tablet:vads-u-margin-bottom--4"
    image={<MediaImage {...image} imageStyle="3_2_medium_thumbnail" />}
  >
    <h3 className="vads-u-font-size--md tablet:vads-u-font-size--lg vads-u-margin-top--0 tablet:vads-u-margin-bottom--0p5">
      <va-link href={link} text={title} />
    </h3>
    <p className="vads-u-margin-y--0">
      {truncateWordsOrChar(introText, 60, true)}
    </p>
  </TextWithImage>
)
