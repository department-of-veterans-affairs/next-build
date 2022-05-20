import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalMedia } from 'next-drupal'
import { drupalClient } from '@/utils/drupalClient'
import Layout from '@/components/layout'
import Container from '@/components/container'
import { MediaImageComponent } from '@/components/media'

interface ImagePageProps {
  media: DrupalMedia
}
const ImagePage = ({ media }: ImagePageProps) => {
  if (!media) return null

  return (
    <Layout>
      <Container className="container">
        {media.map((image) => (
          <MediaImageComponent
            key={image?.id}
            imageStyle="1_1_square_medium_thumbnail"
            image={image}
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
          include: 'image',
          page: {
            limit: 10,
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
