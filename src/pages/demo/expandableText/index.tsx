import Container from '@/templates/common/container'
import { ExpandableText } from '@/templates/components/expandableText'
import { ExpandableTextType } from '@/types/index'
import { queries } from '@/data/queries'

interface ExpandableTextPageProps {
  expandableTextCollectionProps: ExpandableTextType[]
}

export default function ExpandableTextPage({
  expandableTextCollectionProps,
}: ExpandableTextPageProps) {
  return (
    <>
      <Container className="container">
        {expandableTextCollectionProps.map((expandableText) => {
          return (
            <>
              <ExpandableText key={expandableText.id} {...expandableText} />
            </>
          )
        })}
      </Container>
    </>
  )
}

export async function getStaticProps() {
  const expandableTextCollection = await queries.getData(
    'paragraph--expandable_text'
  )

  return {
    props: {
      expandableTextCollectionProps: JSON.parse(
        JSON.stringify(expandableTextCollection)
      ),
    },
  }
}
