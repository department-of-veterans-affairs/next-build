import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Banner } from './index'

export default {
  title: 'Node/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>

const Template: ComponentStory<typeof Banner> = (args) => <Banner {...args} />

export const Example = Template.bind({})
Example.args = {
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'COVID-19 vaccines at VA',
  path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
  body: 'The banner component is part of the VSP Design System Storybook located <a href=https://design.va.gov/storybook/?path=/docs/components-va-banner--default>here</a>',
  alertType: 'information',
  dismiss: true,
}
