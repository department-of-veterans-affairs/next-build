import { v4 as uuidv4 } from 'uuid'
import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalNode } from 'next-drupal'
import Layout from '@/components/layout'
import Container from '@/components/container'
import AudienceTopics from '@/components/paragraph/audience_topics'

interface AudienceTopicsPageProps {
  tags: DrupalNode[]
}

const AudienceTopicsPage = ({ tags }: AudienceTopicsPageProps) => {
  if (!tags) tags = []

  return (
    <Layout>
      <Container className="container">
        {tags.map((paragraph) => (
          <AudienceTopics key={uuidv4()} paragraph={paragraph} />
        ))}
      </Container>
    </Layout>
  )
}

export default AudienceTopicsPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<AudienceTopicsPageProps>> {
  const tags = await drupalClient.getResourceCollectionFromContext<
    DrupalNode[]
  >('paragraph--audience_topics', context, {
    params: {
      include:
        'field_audience_beneficiares, field_non_beneficiares, field_topics',
      page: {
        limit: 20,
      },
    },
  })
  return {
    props: {
      tags,
    },
  }
}
