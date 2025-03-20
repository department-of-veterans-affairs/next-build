import { Meta, StoryObj } from '@storybook/react'

import { VamcSystemVaPolice } from './index'
import mockFieldOfficeMock from '@/mocks/mockFieldOffice.mock'

const meta: Meta<typeof VamcSystemVaPolice> = {
  title: 'Uncategorized/VamcSystemVaPolice',
  component: VamcSystemVaPolice,
}
export default meta

type Story = StoryObj<typeof VamcSystemVaPolice>
const mockWithoutLangCode = { ...mockFieldOfficeMock }
delete mockWithoutLangCode.langcode

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore -- see mockFieldOfficeMock -- media is confused on the drupal types
    field_office: mockWithoutLangCode,
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
    field_cc_faq: {
      id: '42FAQ',
      header: 'FAQ Header',
      type: 'paragraph--q_a_section',
      intro: 'FAQ intro',
      displayAccordion: true,
      questions: [
        {
          id: '42QA',
          header: 'FAQ',
          type: 'paragraph--qa_group',
          question: 'What is the meaning of life?',
          answers: [{ id: '42', html: '42', type: 'paragraph--wysiwyg' }],
        },
      ],
    },
  },
}
