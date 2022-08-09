import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from 'templates/common/container'
import { ParagraphResourceType, ParagraphWysiwyg } from '@/types/data-types/drupal/paragraph'
import { generalEntityDataService } from 'data/delegators/generalEntityDataService'
import { Wysiwyg } from 'templates/components/wysiwyg'

interface WysiwygPageProps {
  wysiwygCollectionProps: any
  className: string
}

const WysiwygPage = ({
  wysiwygCollectionProps,
  className,
}: WysiwygPageProps) => {
  return (
    <Container className="container">
      {wysiwygCollectionProps.map((wysiwygProps) => (
        <Wysiwyg key={wysiwygProps.id} {...wysiwygProps} />
      ))}
    </Container>
  )
}

export default WysiwygPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<WysiwygPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(20)

  const wysiwygCollection = await drupalClient.getResourceCollectionFromContext<
    ParagraphWysiwyg[]
  >(ParagraphResourceType.Wysiwyg, context, {
    params: params.getQueryObject(),
  })
  const wysiwygCollectionProps = generalEntityDataService(wysiwygCollection)
  return {
    props: {
      wysiwygCollectionProps,
      className: 'processed-content',
    },
  }
}
