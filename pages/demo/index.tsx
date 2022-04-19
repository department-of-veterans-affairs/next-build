import { getResource } from 'next-drupal'
import Layout from '@/components/layout';
import Table from '@/components/table/table';
import { buildColumns } from '@/components/table/helpers'

const DemoPage = ({ data }) => {
    if (!data) data = {}
    const { field_table: { value: rows } } = data
    return (<Layout><Table columns={buildColumns(rows)} data={rows} /></Layout>);
}
export default DemoPage


export async function getStaticProps() {
    const data = await getResource(
        "paragraph--table",
        "f3bccd24-a1f4-46f2-94a5-ef04a35ce810"
    )
    return {
        props: {
            data: data || null,
        },
    }
}