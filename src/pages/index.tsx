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
          <Link href="/pittsburgh-health-care/stories/we-honor-outstanding-doctors">
            News Story Example 1
          </Link>
        </li>
        <li>
          <Link href="/pittsburgh-health-care/stories/vietnam-veterans-gift-honors-fallen-soldier-son">
            News Story Example 2
          </Link>
        </li>
        <li>
          <Link href="/pittsburgh-health-care/stories/2022-outstanding-physician-of-the-year">
            News Story Example 3
          </Link>
        </li>
        <li>
          <Link href="/demo/storyListing">News Story Listing</Link>
        </li>
        <li>
          <Link href="/demo/newsStoryTeasers">News Story Teasers</Link>
        </li>
        <li>
          <Link href="/demo/personProfiles">Person Profile</Link>
        </li>
        <li>
          <Link href="/demo/table">Table</Link>
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
