import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalParagraph } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import ExpandableText from '@/components/paragraph/expandable_text'

interface ExpandableTextPageProps {
  expandableTextCollection: DrupalParagraph[]
}

const ExpandableTextPage = ({
  expandableTextCollection,
}: ExpandableTextPageProps) => {
  if (!expandableTextCollection) expandableTextCollection = []

  return (
    <>
      <Container className="container">
        {expandableTextCollection.map((paragraph) => (
          <ExpandableText key={paragraph.id} paragraph={paragraph} />
        ))}
      </Container>
    </>
  )
}

export default ExpandableTextPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ExpandableTextPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(20)

  const expandableTextCollection =
    await drupalClient.getResourceCollectionFromContext<DrupalParagraph[]>(
      'paragraph--expandable_text',
      context,
      {
        params: params.getQueryObject(),
      }
    )
  return {
    props: {
      expandableTextCollection: expandableTextCollection || null,
    },
  }
}
