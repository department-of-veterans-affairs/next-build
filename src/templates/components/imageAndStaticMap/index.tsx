import { MediaImage } from '@/templates/common/mediaImage'
import { recordEvent } from '@/lib/analytics/recordEvent'

import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'

type ImageAndStaticMapProps = {
  image: FormattedMediaImage
  facilityId: string
}

export const ImageAndStaticMap: React.FC<ImageAndStaticMapProps> = ({
  image,
  facilityId,
}) => {
  return (
    <div className="usa-width-one-third inline-table-helper vads-u-order--first mobile-lg:vads-u-order--initial vads-u-margin-bottom--2 vads-u-margin-left--auto facility">
      <div
        onClick={() =>
          recordEvent({ event: 'image-click', 'facility-name': facilityId })
        }
        style={{ cursor: 'pointer' }}
      >
        <MediaImage
          {...image}
          imageStyle="2_1_large"
          className="facility-img"
        />
      </div>
      <div data-widget-type="facility-map" data-facility={facilityId}>
        {/* TODO: Create Facility Map component for display here */}
      </div>
    </div>
  )
}
