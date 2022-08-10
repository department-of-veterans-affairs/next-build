import Link from 'next/link'
import Layout from 'templates/globals/layout'
import Container from 'templates/common/container'
import { getGlobalElements } from '@/lib/context/getGlobalElements'

export const Core = () => {
  return (
    <Container className="container">
      <h2>Components</h2>
      <ul>
        <li>
          <Link href="/demo/blockAlert">Alert Block</Link>
        </li>
        <li>
          <Link href="/demo/audienceTopics">Audience Topics</Link>
        </li>
        <li>
          <Link href="/demo/banner">Banners</Link>
        </li>
        <li>
          <Link href="/demo/bannerAlert">Banners Alert</Link>
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
        <li>
          <Link href="/demo/wysiwyg">Wysiwyg example</Link>
        </li>
        <li>
          <Link href="/demo/richTextCharLimit1000">
            Rich Text Char Limit 1000 example
          </Link>
        </li>
        <li>
          <Link href="/resources/how-do-i-change-my-name-in-my-deers-record">
            Questions and answers example
          </Link>
        </li>
      </ul>
    </Container>
  )
}

const DemoPage = ({ props }) => {
  return (
    <Layout props={props}>
      <Core />
    </Layout>
  )
}

export default DemoPage

export async function getStaticProps(context) {
  return {
    props: {
      ...(await getGlobalElements(context)),
    }, // will be passed to the page component as props
  }
}
