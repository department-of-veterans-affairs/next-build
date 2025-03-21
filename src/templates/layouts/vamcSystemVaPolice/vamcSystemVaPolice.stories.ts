import { Meta, StoryObj } from '@storybook/react'

import { VamcSystemVaPolice } from './index'
import mockFormattedQaSection from '@/mocks/mockFormattedFAQ.mock'

const meta: Meta<typeof VamcSystemVaPolice> = {
  title: 'Uncategorized/VamcSystemVaPolice',
  component: VamcSystemVaPolice,
}
export default meta

type Story = StoryObj<typeof VamcSystemVaPolice>

export const Example: Story = {
  args: {
    id: '0',
    entityId: 0,
    lastUpdated: '2021-09-29T14:00:00Z',
    published: true,
    type: 'node--vamc_system_va_police',
    title: 'Hello World!',
    field_cc_va_police_overview: {
      html: '<p>VA police officers help make VA medical centers and other VA health facilities safe for Veterans and their family members.</p>',
    },
    field_cc_police_report: {
      id: 'pr',
      type: 'paragraph--featured_content',
      title: 'Police Report',
      description: '<p>This is a police report</p>',
      link: {
        id: 'prl',
        label: 'Read more',
        url: 'https://www.va.gov',
      },
    },
    field_phone_numbers_paragraph: {
      number: '123-456-7890',
      label: 'Phone number',
      num_type: 'tel',
    },
    field_cc_faq: mockFormattedQaSection,
    field_cc_term_definitions: {
      expander: 'What do these terms mean?',
      html: '<ul><li>A <strong>citation</strong> is a written record of violating the law.</li><li><strong>Police misconduct&nbsp;</strong>is police behavior that violates the law.</li></ul>',
    },
    field_cc_term_definitions_nation: {
      expander: 'What do these terms mean?',
      html: '<ul><li><strong>Use of force</strong> is when a VA police officer uses physical force to get someone to follow their orders.</li><li><strong>Weapons discharge</strong> is when someone fires a gun.</li></ul>',
    },
  },
}
