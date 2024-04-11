import {
  getSurveyNumber,
  loadForm,
  showForm,
  onMedalliaLoaded,
  setWindowVaSurvey,
} from './medallia'

// Mocking window object
declare global {
  interface Window {
    KAMPYLE_ONSITE_SDK?: {
      loadForm: jest.Mock
      showForm: jest.Mock
    }
    vaSurvey?: string
  }
}

describe('medallis.ts', () => {
  beforeEach(() => {
    window.KAMPYLE_ONSITE_SDK = {
      loadForm: jest.fn(),
      showForm: jest.fn(),
    }
    window.vaSurvey = undefined
  })

  test('getSurveyNumber returns correct survey number based on URL and environment', () => {
    expect(getSurveyNumber('/search', false)).toBe(20)
    expect(getSurveyNumber('/search', true)).toBe(21)
    expect(getSurveyNumber('/unknown-path', false)).toBe(11)
    expect(getSurveyNumber('/unknown-path', true)).toBe(17)
  })

  test('loadForm calls KAMPYLE_ONSITE_SDK.loadForm with correct form number', () => {
    loadForm(20)
    expect(window.KAMPYLE_ONSITE_SDK.loadForm).toHaveBeenCalledWith(20)
  })

  test('showForm calls KAMPYLE_ONSITE_SDK.showForm with correct form number', () => {
    showForm(25)
    expect(window.KAMPYLE_ONSITE_SDK.showForm).toHaveBeenCalledWith(25)
  })

  test('onMedalliaLoaded calls callback immediately if KAMPYLE_ONSITE_SDK is present', () => {
    const callback = jest.fn()
    onMedalliaLoaded(callback)
    expect(callback).toHaveBeenCalled()
  })

  test('onMedalliaLoaded adds event listener if KAMPYLE_ONSITE_SDK is not present', () => {
    window.KAMPYLE_ONSITE_SDK = undefined
    const callback = jest.fn()
    jest.spyOn(window, 'addEventListener')
    onMedalliaLoaded(callback)
    expect(window.addEventListener).toHaveBeenCalledWith(
      'neb_OnsiteLoaded',
      callback
    )
  })

  test('setWindowVaSurvey sets the correct value on window.vaSurvey', () => {
    setWindowVaSurvey('test-survey')
    expect(window.vaSurvey).toBe('test-survey')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
