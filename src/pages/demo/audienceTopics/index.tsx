import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Layout from '@/components/layout'
import Container from '@/components/container'
import { Paragraph } from '@/components/paragraph'
import { ParagraphAudienceTopics } from '@/types/paragraph'

interface AudienceTopicsPageProps {
  tags: ParagraphAudienceTopics[]
}

const AudienceTopicsPage = ({ tags }: AudienceTopicsPageProps) => {
  if (!tags) tags = []

  return (
    <Layout>
      <Container className="container">
        {tags.map((paragraph) => (
          <Paragraph key={paragraph.id} paragraph={paragraph} />
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
    ParagraphAudienceTopics[]
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
