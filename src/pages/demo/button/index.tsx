import { v4 as uuidv4 } from 'uuid'
import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalNode } from 'next-drupal'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Operators from 'drupal-jsonapi-params/lib/operators'
import Container from '@/components/container'
import Button from '@/components/paragraph/button'
import _ from 'lodash'

interface ButtonPageProps {
  buttons: DrupalNode[]
}

const ButtonPage = ({ buttons }: ButtonPageProps) => {
  console.log('buttons ', buttons)
  if (!buttons) buttons = []

  // TODO: Remove once the DrupalJsonApiParams can be implemented
  const filteredButtons = _.filter(buttons, function (button) {
    return (
      button.field_button_label !== null && button.field_button_link !== null
    )
  })

  return (
    <>
      <Container className="container">
        {filteredButtons.map((paragraph) => (
          <Button key={uuidv4()} paragraph={paragraph} />
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
  params
    // .addGroup('button_group', Operators.and)
    // .addFilter('field_button_link', null, Operators.isNotNull, 'button_group')
    // .addFilter('field_button_label', null, 'IS NOT NULL', 'button_group')
    .addPageLimit(20)

  const buttons = await drupalClient.getResourceCollectionFromContext<
    DrupalNode[]
  >('paragraph--button', context, {
    params: params.getQueryObject(),
  })
  return {
    props: {
      buttons: buttons || null,
    },
  }
}
