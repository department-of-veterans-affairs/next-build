import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalMedia } from 'next-drupal'
import { drupalClient } from '@/lib/utils/drupalClient'
import Layout from '@/templates/globals/layout'
import Container from '@/templates/common/container'
import { MediaImageComponent } from '@/templates/common/media'

interface MediaPageProps {
  media: DrupalMedia
}

const ImagePage = ({ media }: MediaPageProps) => {
  if (!media) return null

  return (
    <Layout>
      <Container className="container">
        {media.map((image) => (
          <MediaImageComponent
            key={image?.id}
            image={image}
            imageStyle="1_1_square_medium_thumbnail"
          />
        ))}
      </Container>
    </Layout>
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
  return {
    props: {
      media,
    },
  }
}
