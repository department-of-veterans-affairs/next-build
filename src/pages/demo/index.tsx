import { getResource } from 'next-drupal'
import Layout from '@/components/layout'
import TableComponent from '@/components/paragraphs/table'

const DemoPage = ({ data }) => {
    if (!data) data = {}
    const {
        field_table: { value: rows },
    } = data
    return (
        <Layout>
            <TableComponent data={rows} />
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
