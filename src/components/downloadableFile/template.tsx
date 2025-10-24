import { DownloadableFile as FormattedDownloadableFile } from '@/components/downloadableFile/formatted-type'

export function DownloadableFile({
  title,
  entityId,
  mediaType,
  url,
  extension,
}: FormattedDownloadableFile) {
  const renderMediaContent = () => {
    switch (mediaType) {
      case 'document':
      case 'image':
        return (
          <va-link download={url} href={url} text={`${title} (${extension})`} />
        )
      case 'video':
        return (
          <>
            <va-icon
              className="vads-u-color--link-default"
              icon="youtube"
              size="3"
            />
            <va-link href={url} text={title} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <div
      data-template="paragraphs/downloadable_file"
      data-entity-id={entityId}
      className="vads-u-margin-y--1p5"
    >
      {renderMediaContent()}
    </div>
  )
}
