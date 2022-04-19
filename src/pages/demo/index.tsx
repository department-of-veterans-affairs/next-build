import { getResource } from 'next-drupal'
import Layout from '@/components/layout'
import Table from '@/components/paragraphs/table'
import { buildColumns } from '@/components/paragraphs/table/helpers'

const DemoPage = ({ data }) => {
    if (!data) data = {}
    const {
        field_table: { value: rows },
    } = data
    return (
        <Layout>
            <Table columns={buildColumns(rows)} data={rows} />
        </Layout>
    )
}
export default DemoPage

export async function getStaticProps() {
    const data = await getResource(
        'paragraph--table',
        'fe33b703-5ff0-4681-93fc-bc46d44ffbba'
    )
    return {
        props: {
            data: data || null,
        },
    }
}
