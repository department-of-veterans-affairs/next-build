import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import {
  ParagraphRichTextCharLimit1000,
  ParagraphResourceType,
} from '@/types/paragraph'
<<<<<<< HEAD
import { RichTextCharLimit1000 } from '@/components/rich_text_char_limit_1000'
import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'
=======
import RichTextCharLimit1000 from '@/components/rich_text_char_limit_1000'
>>>>>>> 16a8e29 (RichTextCharLimit1000 refactor merge with main)

interface RichTextCharLimit1000PageProps {
  richTextCharLimit1000CollectionProps: any
  className: string
}

const RichTextCharLimit1000Page = ({
  richTextCharLimit1000CollectionProps,
  className,
}) => {
<<<<<<< HEAD
  if (!richTextCharLimit1000CollectionProps)
    richTextCharLimit1000CollectionProps = []

  return (
    <Container className="container">
      {richTextCharLimit1000CollectionProps.map((richTextCharLimit1000) => (
        <RichTextCharLimit1000
          key={richTextCharLimit1000.id}
          {...richTextCharLimit1000}
=======
  if (!richTextCharLimit1000Collection) richTextCharLimit1000Collection = []

  return (
    <Container className="container">
      {richTextCharLimit1000Collection.map((fieldWysiwyg) => (
        <RichTextCharLimit1000
          key={fieldWysiwyg.id}
          {...fieldWysiwyg}
>>>>>>> 16a8e29 (RichTextCharLimit1000 refactor merge with main)
          className={className}
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

  const richTextCharLimit1000CollectionProps = generalEntityDataService(
    richTextCharLimit1000Collection
  )

  return {
    props: {
      richTextCharLimit1000CollectionProps,
      className: 'processed-content',
    },
  }
}
