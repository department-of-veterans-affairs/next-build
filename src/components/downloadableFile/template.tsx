import { VaIcon ,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
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
          <VaLink download={url} href={url} text={`${title} (${extension})`} />
        )
      case 'video':
        return (
          <>
            <VaIcon
              className="vads-u-color--link-default"
              icon="youtube"
              size={3}
            />
            <VaLink href={url} text={title} />
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
