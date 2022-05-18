import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalParagraph } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import Button from '@/components/paragraph/button'

interface ButtonPageProps {
  buttons: DrupalParagraph[]
}

const ButtonPage = ({ buttons }: ButtonPageProps) => {
  if (!buttons) buttons = []

  return (
    <>
      <Container className="container">
        {buttons.map((paragraph) => (
          <Button key={paragraph.id} paragraph={paragraph} />
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
    DrupalParagraph[]
  >('paragraph--button', context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      buttons: buttons || null,
    },
  }
}
