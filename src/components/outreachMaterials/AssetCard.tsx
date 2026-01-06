import { OutreachAsset, OutreachTopic } from './formatted-type'
import {
  getYouTubeThumbnail,
  getTopicImagePath,
  truncateWithEllipsis,
} from './utils'
import { MediaResourceType } from '@/types/drupal/media'
import { DownloadLink } from './DownloadLink'

interface AssetCardProps {
  asset: OutreachAsset
  topics: OutreachTopic[]
}

export function AssetCard({ asset, topics }: AssetCardProps) {
  const firstCategoryTopicId = asset.categories[0]
  const firstCategory = topics.find((t) => t.topicId === firstCategoryTopicId)
  const title = truncateWithEllipsis(asset.title, 36)
  const description = truncateWithEllipsis(asset.description, 81)

  const renderMediaImage = () => {
    if (asset.media.type === MediaResourceType.Document) {
      // For documents, show topic-based illustration
      const topicId = firstCategoryTopicId
      const imagePath = getTopicImagePath(topicId)
      return <img alt={title} src={imagePath} />
    } else if (asset.media.type === MediaResourceType.Image) {
      // For images, show the actual image
      const imageUrl = asset.absoluteUrl || asset.media.imageUrl
      return <img src={imageUrl} alt={asset.media.imageAlt || asset.title} />
    } else if (asset.media.type === MediaResourceType.Video) {
      // For videos, show thumbnail or YouTube thumbnail
      const thumbnailUrl =
        asset.media.videoThumbnailUrl ||
        getYouTubeThumbnail(asset.media.videoEmbedUrl || undefined)

      // If no thumbnail is available, use topic-based illustration as fallback
      if (!thumbnailUrl) {
        const topicId = firstCategoryTopicId
        const imagePath = getTopicImagePath(topicId)
        return <img alt={title} src={imagePath} />
      }

      return <img alt={title} src={thumbnailUrl} />
    }
    return null
  }

  return (
    <div className="vads-grid-col-12 tablet:vads-grid-col-6 vads-u-margin-bottom--3 vads-u-display--flex vads-u-align-items--stretch">
      <div className="vads-u-padding--3 vads-u-width--full vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row tablet:vads-u-flex-direction--column">
        <div className="mobile-lg:vads-grid-col-4 tablet:vads-grid-col-12">
          {renderMediaImage()}
        </div>

        <div
          className="vads-u-display--flex vads-u-flex-direction--column vads-u-flex--1 vads-u-padding-top--1p5 mobile-lg:vads-u-padding-top--0 tablet:vads-u-padding-top--1p5 mobile-lg:vads-u-padding-left--3 tablet:vads-u-padding-left--0 mobile-lg:vads-grid-col-8 desktop:vads-grid-col-12"
          style={{ minHeight: 0 }}
        >
          {firstCategory && <i>{firstCategory.name}</i>}
          <h2 className="vads-u-margin-y--1 vads-u-font-size--lg">{title}</h2>
          <div className="vads-u-margin-bottom--2">{description}</div>

          <div style={{ marginTop: 'auto' }}>
            <DownloadLink
              media={asset.media}
              absoluteUrl={asset.absoluteUrl}
              fileSize={asset.fileSize}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
