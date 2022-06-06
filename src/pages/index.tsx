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
          <Link href="/demo/emailContacts">Email Contacts</Link>
        </li>
        <li>
          <Link href="/demo/expandableText">Expandable Text</Link>
        </li>
        <li>
          <Link href="/demo/linkTeasers">Link Teasers</Link>
        </li>
        <li>
          <Link href="/demo/media">Media Image</Link>
        </li>
        <li>
          <Link href="/pittsburgh-health-care/stories/">
            News Story Listing
          </Link>
        </li>
        <li>
          <Link href="/pittsburgh-health-care/stories/we-honor-outstanding-doctors">
            News Story Full Page Example
          </Link>
        </li>
        <li>
          <Link href="/demo/personProfiles">Person Profile</Link>
        </li>
        <li>
          <Link href="/demo/table">Table</Link>
        </li>
        <li>
          <Link href="/demo/pagination/exampleA/0">
            Paginiation design system example
          </Link>
        </li>
        <li>
          <Link href="/demo/pagination/exampleB/0">
            Pagination hook example
          </Link>
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
