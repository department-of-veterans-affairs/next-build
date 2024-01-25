import { Meta, StoryObj } from '@storybook/react'

import { BenefitsHubLinks } from './index'

const meta: Meta<typeof BenefitsHubLinks> = {
  title: 'Components/BenefitsHubLinks',
  component: BenefitsHubLinks,
}
export default meta

type Story = StoryObj<typeof BenefitsHubLinks>

export const Example: Story = {
  args: {
    benefitHubs: [
      {
        id: '1',
        label: 'Burials and memorials',
        path: '#',
        teaserText:
          "Get help planning a burial in a VA national cemetery, order a headstone or other memorial item to honor a Veteran's service, and apply for survivor and dependent benefits.",
      },
      {
        id: '2',
        label: 'Health care',
        path: '#',
        teaserText:
          'Apply for VA health care, find out how to access services, and manage your health and benefits online.',
      },
      {
        id: '3',
        label: 'Education and training',
        path: '#',
        teaserText:
          'Apply for and manage your GI Bill and other education benefits to help pay for college and training programs.',
      },
    ],
  },
}
