import { VaIcon } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { Media as FormattedMedia } from './formatted-type'

export const Media = ({
  entityId,
  allowClicksOnThisImage,
  image,
}: FormattedMedia) => (
  <div
    data-template="paragraphs/media"
    data-entity-id={entityId}
    className="vads-u-display--block"
  >
    <div className="va-c-position--relative vads-u-display--inline-block vads-u-margin-y--1p5">
      {allowClicksOnThisImage && (
        <a
          aria-label="Open image in new tab"
          className="vads-u-margin-right--1p5 vads-u-margin-top--1p5 vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center expand-image-button va-c-position--absolute va-c-position-top-right-corner vads-u-justify-content--center"
          href={image.url}
          target="_blank"
        >
          <VaIcon icon="zoom_out_map" size={3}></VaIcon>
        </a>
      )}
      <img src={image.url} alt={image.alt} title={image.title} />
    </div>
  </div>
)
