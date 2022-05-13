import { v4 as uuidv4 } from 'uuid'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalMedia } from 'next-drupal'
import { drupalClient } from '@/utils/drupalClient'
import Layout from '@/components/layout'
import Container from '@/components/container'
import { MediaImage } from '@/components/media'

interface ImagePageProps {
  media: DrupalMedia
}
const ImagePage = ({ media }: ImagePageProps) => {
  if (!media) return null

  return (
    <Layout>
      <Container className="container">
        {media.map((image) => (
          <MediaImage
            key={uuidv4()}
            imageStyle="1_1_square_medium_thumbnail"
            media={image}
          />
        ))}
      </Container>
    </Layout>
  )
}

export default ImagePage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ImagePageProps>> {
  const media =
    await drupalClient.getResourceCollectionFromContext<DrupalMedia>(
      'media--image',
      context,
      {
        params: {
          include: 'image, thumbnail',
          page: {
            limit: 6,
          },
        },
      }
    )
  return {
    props: {
      media,
    },
  }
}
