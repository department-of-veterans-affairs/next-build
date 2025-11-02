import { CampaignLandingPageProps } from './template'

export const VideoPanel = ({ video }: CampaignLandingPageProps) => {
  if (!video.show) {
    return
  }

  return (
    <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            Video
          </p>
          <h2 className="vads-u-margin--0">{video.header}</h2>

          {video.media && (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="vads-u-margin-top--4 medium-screen:vads-u-padding-right--1"
              frameBorder="0"
              height="315"
              src={video.media.field_media_video_embed_field}
              title={video.media.name || 'A related YouTube video'}
              width="100%"
            ></iframe>
          )}

          {video.media?.field_duration && (
            <p className="vads-u-font-size--sm vads-u-margin--0">
              {video.media.field_duration}
              {video.media.field_publication_date && (
                <>
                  &bull;
                  {new Date(
                    video.media.field_publication_date
                  ).toLocaleDateString()}
                </>
              )}
            </p>
          )}

          {video.media?.field_description && (
            <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--0">
              {video.media.field_description}
            </p>
          )}

          {video.button && (
            <p>
              <va-link-action
                className="vads-u-display--block"
                href={video.button.url}
                text={video.button.label}
                type="secondary"
              ></va-link-action>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
