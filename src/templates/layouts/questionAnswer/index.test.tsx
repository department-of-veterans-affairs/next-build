import { render, screen } from '@testing-library/react'
import { QuestionAnswer } from './index'
import { QuestionAnswer as FormattedQuestionAnswer } from '@/types/formatted/questionAnswer'

describe('<QuestionAnswerData> component renders with data', () => {
  const QuestionAnswerData: FormattedQuestionAnswer = {
    id: 'test-id',
    type: 'node--q_a',
    entityId: 1234,
    entityPath: 'sample/path/url',
    published: true,
    lastUpdated: '2021-05-25T14:00:00.000Z',
    title: 'How do I change my name in my DEERS record?',
    answers:
      '<p>You’ll need to call the Defense Manpower Data Center (DMDC) support office. They’ll tell you what documents to provide and what to do next. </p>\n' +
      '<p>Call the DMDC at <a aria-label="8 0 0. 5 3 8. 9 5 5 2." href="tel:+18005389552">800-538-9552</a>. They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. (closed on federal holidays). If you have hearing loss, call TTY: <a aria-label="TTY. 8 6 6. 3 6 3. 2 8 8 3." href="tel:8663632883">866-363-2883</a>.</p>\n' +
      '<p>If you’re a Veteran or family member and you’ve changed your legal name, you must update your name in DEERS. This keeps you eligible for military benefits like TRICARE—and any VA benefits you receive.</p>\n' +
      '<p><strong>Note:</strong> DEERS is the Defense Enrollment Eligibility Reporting System. It’s maintained by the Department of Defense.</p>\n',
    tags: {
      id: 'at-01',
      type: 'paragraph--audience_topics',
      tags: [
        {
          id: '386eb70d-696c-4af3-8986-306ce63d90de',
          href: '/resources/tag/all-veterans',
          name: 'All Veterans',
          categoryLabel: 'Topics',
        },
        {
          id: '8360523e-a4bb-4d36-851f-1c445501c8bf',
          href: '/resources/tag/payments-and-debt',
          name: 'Payments and debt',
          categoryLabel: 'Audience',
        },
      ],
    },
    buttons: [
      {
        id: '26fc6b3e-3063-4459-9339-1b7c8156eb92',
        type: 'paragraph--button',
        url: 'entity:node/15995',
        label: 'Update your name on file with VA',
      },
      {
        id: '2bac7c0a-6578-40e8-b75c-3e7f229cee14',
        type: 'paragraph--button',
        url: 'https://milconnect.dmdc.osd.mil/milconnect/public/faq/DEERS',
        label: 'Go to DEERS FAQs on milConnect',
      },
    ],
    teasers: [
      {
        id: 'e800c299-d555-42da-83e4-301126f09fcf',
        type: 'paragraph--link_teaser',
        uri: 'entity:node/472',
        title: 'Request your military service records (including DD214)',
        options: [null],
        summary: null,
        parentField: 'field_related_information',
        componentParams: {
          boldTitle: false,
          sectionHeader: '',
        },
      },
      {
        id: '6af4b68b-c18a-4ec8-8598-6c5348aaa349',
        type: 'paragraph--link_teaser',
        uri: 'entity:node/8473',
        title: 'Change your address on file with VA',
        options: [null],
        summary: null,
        parentField: 'field_related_information',
        componentParams: {
          boldTitle: false,
          sectionHeader: '',
        },
      },
      {
        id: '8b4e3067-333d-4739-9682-9ab191fe7ad1',
        type: 'paragraph--link_teaser',
        uri: 'entity:node/8259',
        title: 'Managing your VA.gov profile',
        options: [null],
        summary: null,
        parentField: 'field_related_information',
        componentParams: {
          boldTitle: false,
          sectionHeader: '',
        },
      },
    ],
  }

  test('Title to be in the document', () => {
    render(<QuestionAnswer {...QuestionAnswerData} />)
    expect(
      screen.queryByText(/How do I change my name in my DEERS record/)
    ).toBeInTheDocument()
  })

  test('Answer data to be in the document', () => {
    render(<QuestionAnswer {...QuestionAnswerData} />)
    expect(
      screen.queryByText(
        /DEERS is the Defense Enrollment Eligibility Reporting System/
      )
    ).toBeInTheDocument()
  })

  test('<Tag /> data to be in the document', () => {
    render(<QuestionAnswer {...QuestionAnswerData} />)
    expect(screen.queryByText(/All Veterans/)).toBeInTheDocument()
  })

  test('<Teaser /> data to be in the document', () => {
    render(<QuestionAnswer {...QuestionAnswerData} />)
    expect(
      screen.queryByText(/Request your military service records/)
    ).toBeInTheDocument()
  })

  test('<Button /> data to be in the document', () => {
    render(<QuestionAnswer {...QuestionAnswerData} />)
    expect(
      screen.queryByText(/Update your name on file with VA/)
    ).toBeInTheDocument()
  })
  test('Component still renders when ANSWER data is NOT in document', () => {
    QuestionAnswerData.answers = null
    render(<QuestionAnswer {...QuestionAnswerData} />)
    expect(
      screen.queryByText(/How do I change my name in my DEERS record/)
    ).toBeInTheDocument()
  })

  test('Component still renders when TITLE data is NOT in document', () => {
    QuestionAnswerData.title = null
    render(<QuestionAnswer {...QuestionAnswerData} />)
    expect(screen.queryByText(/Tags/)).toBeInTheDocument()
  })
})
