import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { DrupalMedia } from 'next-drupal'
import { drupalClient } from '@/utils/drupalClient'
import { MediaImageComponent, MediaImageProps } from '@/components/media'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'

interface MediaPageProps {
  mediaProps: any
}

const ImagePage = ({ mediaProps }: MediaPageProps) => {
  if (!mediaProps) return null

  return (
    <>
      {mediaProps.map((image) => (
        <MediaImageComponent
          key={image.id}
          {...image}
          imageStyle="1_1_square_medium_thumbnail"
        />
      ))}
    </>
  )
}

export default ImagePage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<MediaPageProps>> {
  const media =
    await drupalClient.getResourceCollectionFromContext<DrupalMedia>(
      'media--image',
      context,
      {
        params: {
          include: 'image',
          page: {
            limit: 10,
          },
        },
      }
    )
  const mediaProps = generalEntityDataService(media)

  return {
    props: {
      mediaProps,
    },
  }
}
