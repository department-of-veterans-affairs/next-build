import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import {
  ParagraphRichTextCharLimit1000,
  ParagraphResourceType,
} from '@/types/paragraph'
import { Paragraph } from '@/components/paragraph'

interface RichTextCharLimit1000PageProps {
  richTextCharLimit1000Collection: ParagraphRichTextCharLimit1000[]
  className: string
}

const RichTextCharLimit1000Page = ({
  richTextCharLimit1000Collection,
  className,
}: RichTextCharLimit1000PageProps) => {
  if (!richTextCharLimit1000Collection) richTextCharLimit1000Collection = []

  return (
    <Container className="container">
      {richTextCharLimit1000Collection.map((fieldWysiwyg) => (
        <Paragraph
          key={fieldWysiwyg.id}
          className={className}
          paragraph={fieldWysiwyg}
        />
      ))}
    </Container>
  )
}

export default RichTextCharLimit1000Page

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<RichTextCharLimit1000PageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(20)

  const richTextCharLimit1000Collection =
    await drupalClient.getResourceCollectionFromContext<
      ParagraphRichTextCharLimit1000[]
    >(ParagraphResourceType.RichTextCharLimit1000, context, {
      params: params.getQueryObject(),
    })

  return {
    props: {
      richTextCharLimit1000Collection,
      className: 'processed-content',
    },
  }
}
