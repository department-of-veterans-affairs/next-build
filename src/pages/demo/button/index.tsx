import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from 'templates/common/container'
import { ParagraphButton, ParagraphResourceType } from '@/types/paragraph'
import { Button } from 'templates/common/button'
import { generalEntityDataService } from 'data/delegators/generalEntityDataService'

interface ButtonPageProps {
  buttonsCollectionProps: any
}

const ButtonPage = ({ buttonsCollectionProps }: ButtonPageProps) => {
  if (!buttonsCollectionProps) buttonsCollectionProps = []

  return (
    <>
      <Container className="container">
        {buttonsCollectionProps.map((button) => (
          <Button key={button.id} {...button} />
        ))}
      </Container>
    </>
  )
}

export default ButtonPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<ButtonPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(30)

  const buttonsCollection = await drupalClient.getResourceCollectionFromContext<
    ParagraphButton[]
  >(ParagraphResourceType.Button, context, {
    params: params.getQueryObject(),
  })

  const buttonsCollectionProps = generalEntityDataService(buttonsCollection)

  return {
    props: {
      buttonsCollectionProps,
    },
  }
}
