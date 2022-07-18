import Link from 'next/link'
import Layout from '@/components/layout'
import Container from '@/components/container'
import NodeListOnly from '@/components/node/story_listing/article_list'

export const Core = () => {
  return (
    <Container className="container">
      <h2>Components</h2>
      <ul>
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
        <NodeListOnly />
      </ul>
    </Container>
  )
}

const DemoPage = ({ footerData }) => {
  return (
    <Layout footerData={footerData}>
      <Core />
    </Layout>
  )
}

export default DemoPage

export async function getStaticProps() {
  const res = await fetch(`https://www.va.gov/generated/headerFooter.json`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }
  const { footerData } = data
  return {
    props: {
      footerData,
    }, // will be passed to the page component as props
  }
}
