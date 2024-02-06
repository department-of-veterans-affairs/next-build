import { Meta, StoryObj } from '@storybook/react'
import HealthServices from './'
import { HealthServices as FormattedHealthServices } from '@/types/formatted/healthServices'

const meta: Meta<typeof HealthServices> = {
  title: 'Components/Health Services',
  component: HealthServices,
}
export default meta

type Story = StoryObj<typeof HealthServices>

const sampleServices: FormattedHealthServices = [
  {
    name: 'PTSD care',
    vetCenterTypeOfCare: 'counseling',
    vetCenterFriendlyName: 'Example name',
    alsoKnownAs: 'AKA Name',
    vetCenterComConditions: 'Common Conditions etc...',
    commonlyTreatedCondition: null,
    vetCenterServiceDescription: 'PTSD care description...',
    description: 'PTSD care detailed description...',
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
    description: 'Couples and family counseling detailed description...',
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
    description: 'Community engagement detailed description...',
    body: '<p>PCommunity engagement body content...</p>',
  },
]

export const Example: Story = {
  args: {
    services: sampleServices,
    typeOfCare: 'counseling',
  },
}
