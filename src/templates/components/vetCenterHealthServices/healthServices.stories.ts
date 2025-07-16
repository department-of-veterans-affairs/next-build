import { Meta, StoryObj } from '@storybook/react'
import VetCenterHealthServices from './'
import { VetCenterHealthServices as FormattedHealthServices } from '@/types/formatted/vetCenterHealthServices'

const meta: Meta<typeof VetCenterHealthServices> = {
  title: 'Components/Health Services',
  component: VetCenterHealthServices,
}
export default meta

type Story = StoryObj<typeof VetCenterHealthServices>

const sampleServices: FormattedHealthServices = [
  {
    name: 'PTSD care',
    vetCenterTypeOfCare: 'counseling',
    vetCenterFriendlyName: 'Example name',
    alsoKnownAs: 'AKA Name',
    vetCenterComConditions: 'Common Conditions etc...',
    commonlyTreatedCondition: null,
    vetCenterServiceDescription: 'PTSD care description...',
    body: '<p>PTSD care body content...</p>',
  },
  {
    name: 'Couples and family counseling',
    vetCenterTypeOfCare: 'counseling',
    vetCenterFriendlyName: null,
    alsoKnownAs: null,
    vetCenterComConditions: null,
    commonlyTreatedCondition: null,
    vetCenterServiceDescription: 'Couples and family counseling...',
    body: '<p>Couples and family counseling body content...</p>',
  },
  {
    name: 'Community engagement',
    vetCenterTypeOfCare: 'counseling',
    vetCenterFriendlyName: null,
    alsoKnownAs: null,
    vetCenterComConditions: null,
    commonlyTreatedCondition: null,
    vetCenterServiceDescription: 'Community engagement description...',
    body: '<p>PCommunity engagement body content...</p>',
  },
]

export const Example: Story = {
  args: {
    services: sampleServices,
    typeOfCare: 'counseling',
  },
}
