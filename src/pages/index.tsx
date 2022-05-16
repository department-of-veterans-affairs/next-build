import Link from 'next/link'
import Layout from '@/components/layout'
import Container from '@/components/container'

export const Core = () => {
  return (
    <Container className="container">
      <h2>Components</h2>
      <ul>
        <li>
          <Link href="/demo/audienceTopics">Audience Topics</Link>
        </li>
        <li>
          <Link href="/demo/partials/benefitHubsLinks">Benefit Hubs Links</Link>
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
    </Container>
  )
}

const DemoPage = () => {
  return (
    <Layout>
      <Core />
    </Layout>
  )
}

export default DemoPage
