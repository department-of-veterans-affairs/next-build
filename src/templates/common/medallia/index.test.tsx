import { render, screen } from '@testing-library/react'
import { MedalliaAssets } from './'
import { recordEvent } from '@/lib/analytics/recordEvent'

// Mock Script
jest.mock('next/script', () => ({ id, src }) => (
  <div data-testid={id} data-src={src} />
))

// Mock medallia
jest.mock('@/lib/utils/medallia', () => ({
  getSurveyNumber: jest.fn(),
  loadForm: jest.fn(),
  onMedalliaLoaded: jest.fn((callback) => callback()),
  setWindowVaSurvey: jest.fn(),
}))

// Mock recordEvent
jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

interface MedalliaEvent extends CustomEvent {
  detail: {
    Form_Type?: string
    Form_ID?: string
    Feedback_UUID?: string
    Content?: string
  }
}

const mockEventDetail: MedalliaEvent = {
  detail: {},
  initCustomEvent: function (
    type: string,
    bubbles?: boolean,
    cancelable?: boolean,
    detail?: unknown
  ): void {
    throw new Error('Function not implemented.')
  },
  bubbles: false,
  cancelBubble: false,
  cancelable: false,
  composed: false,
  currentTarget: undefined,
  defaultPrevented: false,
  eventPhase: 0,
  isTrusted: false,
  returnValue: false,
  srcElement: undefined,
  target: undefined,
  timeStamp: 0,
  type: '',
  composedPath: function (): EventTarget[] {
    throw new Error('Function not implemented.')
  },
  initEvent: function (
    type: string,
    bubbles?: boolean,
    cancelable?: boolean
  ): void {
    throw new Error('Function not implemented.')
  },
  preventDefault: function (): void {
    throw new Error('Function not implemented.')
  },
  stopImmediatePropagation: function (): void {
    throw new Error('Function not implemented.')
  },
  stopPropagation: function (): void {
    throw new Error('Function not implemented.')
  },
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3,
}

describe('MedalliaAssets Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('renders Script component with correct props', () => {
    // Mocking useEffect
    jest.mock('react', () => ({
      ...jest.requireActual('react'),
      useEffect: jest.fn(),
    }))
    process.env.NEXT_PUBLIC_BUILD_TYPE = 'local'

    render(<MedalliaAssets />)

    const scriptElement = screen.getByTestId('medallia') as HTMLDivElement
    expect(scriptElement).toBeInTheDocument()

    const expectedSrc =
      'https://resource.digital.voice.va.gov/wdcvoice/5/onsite/embed.js'
    expect(scriptElement.getAttribute('data-src')).toEqual(expectedSrc)
  })
  test('adds listener and calls recordEvent when triggered for Medallia event with UUID and Content', () => {
    const eventDetail = {
      ...mockEventDetail,
      detail: {
        Form_Type: 'Test Form',
        Form_ID: '12345',
        Feedback_UUID: 'abc-123',
        Content: 'Test Content',
      },
    }
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')

    render(<MedalliaAssets />)

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'MDigital_Feedback_Submit',
      expect.any(Function),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )

    // Simulate the event listener being triggered
    const eventHandler = addEventListenerSpy.mock.calls.find(
      (call): call is [string, (event: CustomEvent) => void] =>
        call[0] === 'MDigital_Feedback_Submit'
    )?.[1]
    if (eventHandler) {
      eventHandler(eventDetail)
    }

    // Assert that recordEvent is called with the correct data
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'survey-submit',
      'survey-tool': 'Medallia',
      'survey-form-id': '12345',
      'survey-status': 'Test Form',
      'survey-details': { feedbackUUID: 'abc-123', content: 'Test Content' },
    })

    addEventListenerSpy.mockRestore()
  })
  test('adds listener and calls recordEvent when triggered for Medallia event with label', () => {
    const eventDetail = {
      ...mockEventDetail,
      detail: {
        Form_Type: 'Test Form',
        Form_ID: '12345',
      },
    }
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')

    render(<MedalliaAssets />)

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'MDigital_Invite_Displayed',
      expect.any(Function),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
    // Simulate the event listener being triggered
    const eventHandler = addEventListenerSpy.mock.calls.find(
      (call): call is [string, (event: CustomEvent) => void] =>
        call[0] === 'MDigital_Invite_Displayed'
    )?.[1]
    if (eventHandler) {
      eventHandler(eventDetail)
    }

    // Assert that recordEvent is called with the correct data
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'survey-invitation-display',
      'survey-tool': 'Medallia',
      'survey-form-id': '12345',
      'survey-status': 'Invite',
      'survey-details': {},
    })

    addEventListenerSpy.mockRestore()
  })
})
