import Link from 'next/link';
import { getResourceCollectionFromContext } from 'next-drupal';
import { v4 as uuidv4 } from 'uuid';

export const FIELDS =
  'field_answer,field_alert_single,field_buttons,field_tags,field_related_information,field_related_benefit_hubs,field_contact_information';


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
  return (<Core nodes={nodes} />);
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

