import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import { ParagraphWysiwyg, ParagraphResourceType } from '@/types/paragraph'
import { Paragraph } from '@/components/paragraph'

interface WysiwygPageProps {
  wysiwygCollection: ParagraphWysiwyg[]
  className: string
}

const WysiwygPage = ({ wysiwygCollection, className }: WysiwygPageProps) => {
  if (!wysiwygCollection) wysiwygCollection = []

  return (
    <Container className="container">
      {wysiwygCollection.map((fieldWysiwyg) => (
        <Paragraph
          key={fieldWysiwyg.id}
          className={className}
          paragraph={fieldWysiwyg}
        />
      ))}
    </Container>
  )
}

export default WysiwygPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<WysiwygPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(10)

  const wysiwygCollection = await drupalClient.getResourceCollectionFromContext<
    ParagraphWysiwyg[]
  >(ParagraphResourceType.Wysiwyg, context, {
    params: params.getQueryObject(),
  })

  return {
    props: {
      wysiwygCollection,
      className: 'processed-content',
    },
  }
}
