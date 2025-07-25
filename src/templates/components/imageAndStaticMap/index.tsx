import { MediaImage } from '@/templates/common/mediaImage'

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
    <>
      <MediaImage
        {...image}
        imageStyle="3_2_medium_thumbnail"
        className="facility-img"
      />
      <div data-widget-type="facility-map" data-facility={facilityId}>
        {/* TODO: Create Facility Map component for display here */}
      </div>
    </>
  )
}
