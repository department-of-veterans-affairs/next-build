import { drupalClient } from '@/lib/utils/drupalClient'
import Layout from 'templates/layout'
import Container from 'templates/container'
import { Table } from 'templates/table'
import { ParagraphResourceType } from '@/types/paragraph'

const TablePage = ({ data }) => {
  if (!data) data = {}

  const {
    field_table: { value: tableData },
  } = data

  return (
    <Layout>
      <Container className="container">
        <Table data={tableData} />
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
