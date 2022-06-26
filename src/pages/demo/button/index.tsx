import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import { Paragraph } from '@/components/paragraph'
import { ParagraphButton, ParagraphResourceType } from '@/types/paragraph'

interface ButtonPageProps {
  buttons: ParagraphButton[]
}

const ButtonPage = ({ buttons }: ButtonPageProps) => {
  if (!buttons) buttons = []

  return (
    <>
      <Container className="container">
        {buttons.map((paragraphButton) => (
          <Paragraph key={paragraphButton.id} paragraph={paragraphButton} />
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

  const buttons = await drupalClient.getResourceCollectionFromContext<
    ParagraphButton[]
  >(ParagraphResourceType.Button, context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      buttons,
    },
  }
}
