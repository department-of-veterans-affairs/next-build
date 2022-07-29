import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import {
  ParagraphExpandableText,
  ParagraphResourceType,
} from '@/types/paragraph'

import { generalEntityDataService } from '@/lib/delegators/generalEntityDataService'
import { ExpandableText } from '@/components/expandable_text'
import { Paragraph } from '@/lib/delegators/Paragraph'

interface ExpandableTextPageProps {
  expandableTextCollectionProps: any
}

const ExpandableTextPage = ({
  expandableTextCollectionProps,
}: ExpandableTextPageProps) => {
  return (
    <>
      <Container className="container">
        {expandableTextCollectionProps.map((expandableTextProps) => {
          return (
            <>
              <ExpandableText
                key={expandableTextProps.id}
                {...expandableTextProps}
              />
            </>
          )
        })}
      </Container>
    </>
  )
}

export default ExpandableTextPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ExpandableTextPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(20)

  const expandableTextCollection =
    await drupalClient.getResourceCollectionFromContext<
      ParagraphExpandableText[]
    >(ParagraphResourceType.ExpandableText, context, {
      params: params.getQueryObject(),
    })

  const expandableTextCollectionProps = generalEntityDataService(
    expandableTextCollection
  )
  return {
    props: {
      expandableTextCollectionProps,
    },
  }
}
