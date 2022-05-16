import Link from 'next/link'
import Layout from '@/components/layout'
import Container from '@/components/container'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { drupalClient } from '@/utils/drupalClient'
import { DrupalMedia } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const Core = ({ nodes }) => {
  return (
    <Layout>
      <Container className="container">
        <h2>Components</h2>
        <ul>
          <li>
            <Link href="/demo/audienceTopics">Audience Topics</Link>
          </li>
          <li>
            <Link href="/demo/partials/benefitHubsLinks">
              Benefit Hubs Links
            </Link>
          </li>
          <li>
            <Link href="/demo/button">Button</Link>
          </li>
          <li>
            <Link href="/demo/personProfiles">Person Profile</Link>
          </li>

          <li>
            <Link href="/demo/paragraph">Paragraph</Link>
          </li>
          <li>
            <Link href="/demo/table">Table</Link>
          </li>
          <li>
            <Link href="/demo/media">Media Image</Link>
          </li>
        </ul>

        <h2>Example News Story pages</h2>
        <ul>
          {nodes.map((node) => {
            return (
              <li key={node.id}>
                <Link href={node.path.alias}>{node.title}</Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ImagePageProps>> {
  const params = new DrupalJsonApiParams()
    .addInclude(['field_media', 'field_media.image', 'field_author'])
    .addPageLimit(20)
  const nodes =
    await drupalClient.getResourceCollectionFromContext<DrupalMedia>(
      'node--news_story',
      context,
      {
        params: params.getQueryObject(),
      }
    )
  return {
    props: {
      nodes,
    },
  }
}

export default Core
