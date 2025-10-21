import { placeholders } from './placeholders.temp'

export const VideoPanel = () => {
  return (
    placeholders.fieldClpVideoPanel && (
      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              Video
            </p>
            <h2 className="vads-u-margin--0">
              {placeholders.fieldClpVideoPanelHeader}
            </h2>

            {/* TODO: createEmbedYouTubeVideoURL filter - need helper function */}
            {placeholders.fieldMedia.entity.fieldMediaVideoEmbedField && (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="vads-u-margin-top--4 medium-screen:vads-u-padding-right--1"
                frameBorder="0"
                height="315"
                src={placeholders.fieldMedia.entity.fieldMediaVideoEmbedField}
                title={
                  placeholders.fieldMedia.entity.name ||
                  'A related YouTube video'
                }
                width="100%"
              ></iframe>
            )}

            {placeholders.fieldMedia.entity.fieldDuration && (
              <p className="vads-u-font-size--sm vads-u-margin--0">
                {/* TODO: formatSeconds filter - need helper function */}
                {placeholders.fieldMedia.entity.fieldDuration}
                {placeholders.fieldMedia.entity.fieldDuration &&
                  placeholders.fieldMedia.entity.fieldPublicationDate.date && (
                    <> &bull; </>
                  )}
                {/* TODO: humanizeDate filter - need helper function */}
                {placeholders.fieldMedia.entity.fieldPublicationDate.date}
              </p>
            )}

            {placeholders.fieldMedia.entity.fieldDescription && (
              <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--0">
                {placeholders.fieldMedia.entity.fieldDescription}
              </p>
            )}

            {placeholders.fieldClpVideoPanelMoreVideo.entity.fieldButtonLink.url
              .path &&
              placeholders.fieldClpVideoPanelMoreVideo.entity
                .fieldButtonLabel && (
                <p>
                  <va-link-action
                    className="vads-u-display--block"
                    href={
                      placeholders.fieldClpVideoPanelMoreVideo.entity
                        .fieldButtonLink.url.path
                    }
                    text={
                      placeholders.fieldClpVideoPanelMoreVideo.entity
                        .fieldButtonLabel
                    }
                    type="secondary"
                  ></va-link-action>
                </p>
              )}
          </div>
        </div>
      </div>
    )
  )
}
