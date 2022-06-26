import { drupalClient } from '@/utils/drupalClient'
import Layout from '@/components/layout'
import Container from '@/components/container'
import Table from '@/components/paragraph/table'
import { ParagraphResourceType } from '@/types/paragraph'

const TablePage = ({ data }) => {
  if (!data) data = {}

  const {
    field_table: { value: rows },
  } = data

  return (
    <Layout>
      <Container className="container">
        <Table data={rows} />
      </Container>
    </Layout>
  )
}

export default TablePage

export async function getStaticProps() {
  const data = await drupalClient.getResource(
    ParagraphResourceType.Table,
    'fe33b703-5ff0-4681-93fc-bc46d44ffbba'
  )
  return {
    props: {
      data: data || null,
    },
  }
}
