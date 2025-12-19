import { OutreachAsset, OutreachTopic } from './formatted-type'
import { getYouTubeThumbnail, getTopicImagePath } from './utils'
import { MediaResourceType } from '@/types/drupal/media'
import { DownloadLink } from './DownloadLink'

interface AssetCardProps {
  asset: OutreachAsset
  index: number
  topics: OutreachTopic[]
}

export function AssetCard({ asset, index, topics }: AssetCardProps) {
  const firstCategoryTopicId = asset.categories[0]
  const firstCategory = topics.find((t) => t.topicId === firstCategoryTopicId)

  const renderMediaImage = () => {
    if (asset.media.type === MediaResourceType.Document) {
      // For documents, show topic-based illustration
      const topicId = firstCategoryTopicId
      const imagePath = getTopicImagePath(topicId)
      return (
        <img
          alt={
            asset.title.length > 36
              ? `${asset.title.substring(0, 36)}...`
              : asset.title
          }
          src={imagePath}
        />
      )
    } else if (asset.media.type === MediaResourceType.Image) {
      // For images, show the actual image
      const imageUrl = asset.absoluteUrl || asset.media.imageUrl
      return <img src={imageUrl} alt={asset.media.imageAlt || asset.title} />
    } else if (asset.media.type === MediaResourceType.Video) {
      // For videos, show thumbnail or YouTube thumbnail
      const thumbnailUrl =
        asset.media.videoThumbnailUrl ||
        getYouTubeThumbnail(asset.media.videoEmbedUrl || undefined) ||
        ''
      return (
        <img
          alt={
            asset.title.length > 36
              ? `${asset.title.substring(0, 36)}...`
              : asset.title
          }
          src={thumbnailUrl}
        />
      )
    }
    return null
  }

  // Build topics string for data attribute (space-separated topic IDs)
  const topicsString = asset.categories.join(' ')

  return (
    <div
      data-topic={topicsString}
      data-type={asset.format}
      data-number={index + 1}
      className="vads-grid-col-12 desktop:vads-grid-col-6 vads-u-margin-bottom--3 vads-u-display--flex vads-u-align-items--stretch"
    >
      <div className="vads-u-padding--3 vads-u-background-color--gray-lightest">
        <div
          className={`tablet:vads-grid-col-4 desktop:vads-grid-col-12 ${
            asset.media.type === MediaResourceType.Document
              ? 'document-asset-wrap'
              : asset.media.type === MediaResourceType.Image
                ? 'image-asset-wrap'
                : 'video-asset-wrap'
          }`}
        >
          {renderMediaImage()}
        </div>

        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-top--1p5 tablet:vads-u-padding-left--3 desktop-lg:vads-u-padding-left--0 tablet:vads-grid-col--8 desktop:vads-grid-col--12">
          {firstCategory && <i>{firstCategory.name}</i>}
          <h2 className="vads-u-margin-y--1 vads-u-font-size--lg">
            {asset.title.length > 36
              ? `${asset.title.substring(0, 36)}...`
              : asset.title}
          </h2>
          <div className="vads-u-margin-bottom--2">
            {asset.description.length > 81
              ? `${asset.description.substring(0, 81)}...`
              : asset.description}
          </div>

          <div>
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
