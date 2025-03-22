import { Meta, StoryObj } from '@storybook/react'

import { VamcSystemFacilityPage } from './index'
import mockFormattedQaSection from '@/mocks/formattedFAQ.mock'
import { LOVELL } from '@/lib/drupal/lovell/constants'

const meta: Meta<typeof VamcSystemFacilityPage> = {
  title: 'Common/VamcSystemFacilityPage',
  component: VamcSystemFacilityPage,
}
export default meta

type Story = StoryObj<typeof VamcSystemFacilityPage>

export const Example: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This is a common layout for VAMC pages under a  VA System. It includes a Lovell switcher, a feedback button, and a back to top button. If you zoom in (on your browser not with the storybook zoom, you can see the back to top appear)',
      },
    },
  },
  args: {
    lastUpdated: '2021-09-29T14:00:00Z',
    children: (
      <div
        className="vads-u-padding--2"
        style={{
          backgroundColor: '#ff00001a',
          height: '1000px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          Lovell switcher will go here when you provide a variant and we include
          the properties
        </div>
        <div>
          Just a random div to take up space so the back to top shows up
        </div>
        Hello World!
      </div>
    ),
    includeFeedbackButton: true,
    switchPath: '/lovell',
    path: '/vamc-system-va-police',
  },
}
