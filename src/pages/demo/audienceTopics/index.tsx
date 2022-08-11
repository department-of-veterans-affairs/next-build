import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Wrapper } from '@/templates/globals/wrapper'
import Container from '@/templates/common/container'
import {
  ParagraphAudienceTopics,
  ParagraphResourceType,
} from '@/types/dataTypes/drupal/paragraph'
import { AudienceTopics } from '@/templates/components/audienceTopics'
import { generalEntityDataService } from '@/data/delegators/generalEntityDataService'

interface AudienceTopicsPageProps {
  audienceTopicsCollectionProps: any
}

const AudienceTopicsPage = ({
  audienceTopicsCollectionProps,
}: AudienceTopicsPageProps) => {
  if (!audienceTopicsCollectionProps) audienceTopicsCollectionProps = []

  return (
    <Wrapper>
      <Container className="container">
        {audienceTopicsCollectionProps.map((audienceTopicProp) => (
          <AudienceTopics key={audienceTopicProp.id} {...audienceTopicProp} />
        ))}
      </Container>
    </Wrapper>
  )
}

export default AudienceTopicsPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AudienceTopicsPageProps>> {
  const audienceTopicsCollection =
    await drupalClient.getResourceCollectionFromContext<
      ParagraphAudienceTopics[]
    >(ParagraphResourceType.AudienceTopics, context, {
      params: {
        include:
          'field_audience_beneficiares, field_non_beneficiares, field_topics',
        page: {
          limit: 20,
        },
      },
    })

  const audienceTopicsCollectionProps = generalEntityDataService(
    audienceTopicsCollection
  )

  return {
    props: {
      audienceTopicsCollectionProps,
    },
  }
}
