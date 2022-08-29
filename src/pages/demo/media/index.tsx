import { useState, useEffect } from 'react'
import { queries } from '@/data/queries'
import Container from '@/templates/common/container'
import { MediaImageComponent } from '@/templates/common/media'
import { MediaResourceType } from '@/types/dataTypes/drupal/media'
import { MediaImageType } from '@/types/index'

interface MediaPageProps {
  MediaCollectionProps: MediaImageType[]
}

export default function MediaImageDemo({
  MediaCollectionProps,
}: MediaPageProps) {
  const [images, setImages] = useState([])
  const [showImages, setShowImages] = useState(false)

  useEffect(() => {
    if (MediaCollectionProps) {
      setImages(MediaCollectionProps)
      setShowImages(true)
    }
    return () => {
      setShowImages(false)
    }
  }, [MediaCollectionProps])

  return (
    <Container className="container">
      <ul className="usa-unstyled-list">
        {showImages &&
          images.map((image) => (
            <MediaImageComponent
              key={image.id}
              {...image}
              imageStyle="1_1_square_medium_thumbnail"
            />
          ))}
      </ul>
    </Container>
  )
}

export async function getStaticProps() {
  const mediaImageCollection = await queries.getData(MediaResourceType.Image)
  return {
    props: {
      MediaCollectionProps: mediaImageCollection,
    },
  }
}
