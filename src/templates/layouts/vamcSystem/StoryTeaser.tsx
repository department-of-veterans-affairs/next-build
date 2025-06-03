import { MediaImage } from '@/templates/common/mediaImage'
import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { NewsStoryTeaser as FormattedNewsStoryTeaser } from '@/types/formatted/newsStory'

/** Story teaser component converted from news_story.drupal.liquid */
export const StoryTeaser = ({
  title,
  link,
  image,
  introText,
}: FormattedNewsStoryTeaser) => (
  <div
    data-template="teasers/news_story"
    className="vads-grid-row vads-grid-gap-5 vads-u-margin-bottom--3 tablet:vads-u-margin-bottom--4 vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row"
  >
    <div className="mobile-lg:vads-grid-col-6 tablet:vads-grid-col-8">
      <h3 className="vads-u-font-size--md tablet:vads-u-font-size--lg vads-u-margin-top--0 tablet:vads-u-margin-bottom--0p5">
        <va-link href={link} text={title} />
      </h3>
      <p className="vads-u-margin-y--0">
        {truncateWordsOrChar(introText, 60, true)}
      </p>
    </div>
    <div className="mobile-lg:vads-grid-col-6 tablet:vads-grid-col-4 vads-u-order--first mobile-lg:vads-u-order--initial vads-u-margin-bottom--2 tablet:vads-u-margin-bottom--0">
      <MediaImage {...image} imageStyle="3_2_medium_thumbnail" />
    </div>
  </div>
)
