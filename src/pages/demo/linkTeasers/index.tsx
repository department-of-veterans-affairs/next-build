import Container from '@/templates/common/container'
import { LinkTeaser } from '@/templates/components/linkTeaser'
import { queries } from '@/data/queries'
import { ParagraphResourceType } from '@/types/dataTypes/drupal/paragraph'
import { LinkTeaserType } from '@/types/index'

const linkTeaserParams = { boldTitle: false, sectionHeader: '' }

interface LinkTeaserPageProps {
  LinkTeaserCollectionProps: LinkTeaserType[]
  componentParams?: {
    boldTitle: boolean
    sectionHeader: string
  }
}

export default function LinkTeaserPage({
  LinkTeaserCollectionProps,
}: LinkTeaserPageProps) {
  if (!LinkTeaserCollectionProps) LinkTeaserCollectionProps = []

  return (
    <>
      <Container className="container">
        <ul className="usa-unstyled-list">
          {LinkTeaserCollectionProps.map((linkTeaser) => (
            <LinkTeaser
              key={linkTeaser.id}
              {...linkTeaser}
              componentParams={linkTeaserParams}
            />
          ))}
        </ul>
      </Container>
    </>
  )
}

export async function getStaticProps() {
  const linkTeaserCollection = await queries.getData(
    ParagraphResourceType.LinkTeaser
  )

  return {
    props: {
      LinkTeaserCollectionProps: JSON.parse(
        JSON.stringify(linkTeaserCollection)
      ),
    },
  }
}
