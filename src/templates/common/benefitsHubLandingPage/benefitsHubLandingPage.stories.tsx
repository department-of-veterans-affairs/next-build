import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BenefitsHubLandingPage } from './index'

export default {
  title: 'Paragraphs/Benefits Hub Landing Page',
  component: BenefitsHubLandingPage,
} as ComponentMeta<typeof BenefitsHubLandingPage>

const Template: ComponentStory<typeof BenefitsHubLandingPage> = (args) => (
  <BenefitsHubLandingPage {...args} />
)

export const Example = Template.bind({})
Example.args = {
  id: '186eb70d-696c-4af3-8986-306ce63d90de',
  title: 'Evidence to support VA pension, DIC, or accrued benefits claims',
  introText: 'Find the phone number to call for the help you need.',
  relatedBenefitHubs: [
    {
      id: '386eb70d-696c-4af3-8986-306ce63d90de',
      url: '/resources/helpful-va-phone-numbers',
      title: 'VA health care',
      homePageHubLabel: 'Health Care',
      teaserText:
        'Apply for VA health care, find out how to access services, and manage your health and benefits online.',
    },
    {
      id: '286eb70d-696c-4af3-8986-306ce63d90de',
      url: '/resources/change-your-address-on-file-with-va',
      title: 'VA disability compensation',
      homePageHubLabel: 'Education and training',
      teaserText:
        'Apply for and manage your GI Bill and other education benefits to help pay for college and training programs.',
    },
  ],
}
