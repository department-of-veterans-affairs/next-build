import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import {
  ParagraphExpandableText,
  ParagraphResourceType,
} from '@/types/paragraph'
import { Paragraph } from '@/lib/delegators/Paragraph'

interface ExpandableTextPageProps {
  expandableTextCollection: ParagraphExpandableText[]
}

const ExpandableTextPage = ({
  expandableTextCollection,
}: ExpandableTextPageProps) => {
  if (!expandableTextCollection) expandableTextCollection = []

  return (
    <>
      <Container className="container">
        {expandableTextCollection.map((paragraphExpandableText) => (
          <Paragraph
            key={paragraphExpandableText.id}
            paragraph={paragraphExpandableText}
          />
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
    await drupalClient.getResourceCollectionFromContext<
      ParagraphExpandableText[]
    >(ParagraphResourceType.ExpandableText, context, {
      params: params.getQueryObject(),
    })
  return {
    props: {
      expandableTextCollection,
    },
  }
}
