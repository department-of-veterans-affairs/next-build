import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from 'templates/container'
import {
  ParagraphRichTextCharLimit1000,
  ParagraphResourceType,
} from '@/types/paragraph'
import { RichTextCharLimit1000 } from 'templates/richTextCharLimit1000'
import { generalEntityDataService } from 'data/delegators/generalEntityDataService'

interface RichTextCharLimit1000PageProps {
  richTextCharLimit1000CollectionProps: any
  className: string
}

const RichTextCharLimit1000Page = ({
  richTextCharLimit1000CollectionProps,
  className,
}) => {
  if (!richTextCharLimit1000CollectionProps)
    richTextCharLimit1000CollectionProps = []

  return (
    <Container className="container">
      {richTextCharLimit1000CollectionProps.map((richTextCharLimit1000) => (
        <RichTextCharLimit1000
          key={richTextCharLimit1000.id}
          {...richTextCharLimit1000}
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
