import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { getResourceCollectionFromContext } from 'next-drupal';
import Layout from '@/components/layout';
import { FIELDS } from '@/lib/constants/';



export const Core = ({ nodes }) => {
  if (!nodes) return null;
  return (
    nodes.map(node => (
      (<h2 role='header'
        key={uuidv4()}>
        <Link href={
          node.path?.alias
            ? node.path?.alias
            : ' '
        }
          passHref><a>{node?.title}</a></Link></h2>)
    ))
  );
};



const HomePage = ({ nodes }) => {
  if (nodes.length === 0) {
    return <div>No nodes found</div>;
  }
  return (<Layout><Core nodes={nodes} /></Layout>);
}



export default HomePage

export async function getStaticProps(context) {

  const nodes = await getResourceCollectionFromContext('node--q_a', context, {
    params: {
      include: FIELDS,
      sort: '-created',
      'filter[field_standalone_page]': '1',
      'filter[status][value]': '1',
    },
  });

  return {
    props: {
      nodes: nodes || null,
    },
  };
}


