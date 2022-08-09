import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Layout from 'templates/layout'
import Container from 'templates/container'
import {
  ParagraphAudienceTopics,
  ParagraphResourceType,
} from '@/types/paragraph'
import { AudienceTopics } from 'templates/audience_topics'
import { generalEntityDataService } from 'data/delegators/generalEntityDataService'

interface AudienceTopicsPageProps {
  audienceTopicsCollectionProps: any
}

const AudienceTopicsPage = ({
  audienceTopicsCollectionProps,
}: AudienceTopicsPageProps) => {
  if (!audienceTopicsCollectionProps) audienceTopicsCollectionProps = []

  return (
    <Layout>
      <Container className="container">
        {audienceTopicsCollectionProps.map((audienceTopicProp) => (
          <AudienceTopics key={audienceTopicProp.id} {...audienceTopicProp} />
        ))}
      </Container>
    </Layout>
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
