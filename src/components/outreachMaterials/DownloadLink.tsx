import { OutreachAssetMedia } from './formatted-type'
import { formatFileSize, getFileExtension } from './utils'
import { MediaResourceType } from '@/types/drupal/media'

interface DownloadLinkProps {
  media: OutreachAssetMedia
  absoluteUrl?: string
  fileSize?: number
}

export function DownloadLink({
  media,
  absoluteUrl,
  fileSize,
}: DownloadLinkProps) {
  if (media.type === MediaResourceType.Document) {
    const url = absoluteUrl || media.documentUrl || ''
    const extension = getFileExtension(url)
    const filesize = media.documentFilesize || fileSize
    const sizeText = filesize ? formatFileSize(filesize) : ''
    const linkText = `Download ${extension}${sizeText ? ` (${sizeText})` : ''}`

    return <va-link download href={url} text={linkText} />
  }

  if (media.type === MediaResourceType.Image) {
    const url = absoluteUrl || media.imageUrl || ''
    const extension = getFileExtension(url)
    const filesize = media.imageFilesize || fileSize
    const sizeText = filesize ? formatFileSize(filesize) : ''
    const linkText = `Download ${extension}${sizeText ? ` (${sizeText})` : ''}`

    return <va-link download={url} href={url} text={linkText} />
  }

  if (media.type === MediaResourceType.Video) {
    return (
      <>
        <va-icon
          className="vads-u-color--link-default"
          icon="youtube"
          size="3"
        />
        <va-link href={media.videoEmbedUrl || ''} text="Go to video" />
      </>
    )
  }

  return null
}
