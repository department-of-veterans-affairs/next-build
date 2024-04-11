import * as analytics from '@/lib/analytics'
import TagManager from 'react-gtm-module'
import { recordEvent, recordEventOnce } from './recordEvent'

jest.mock('react-gtm-module')

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[]
  }
}

describe('Analytics Functions', () => {
  describe('pageview', () => {
    it('should log the pageview with the given URL', () => {
      const url = '/example-url'

      analytics.pageview(url)

      expect(TagManager.dataLayer).toHaveBeenCalledWith({
        dataLayer: {
          event: 'pageview',
          page: url,
        },
      })
    })
  })

  describe('recordEvent', () => {
    it('calls the analytics event function with the provided data', () => {
      const testData = { action: 'testAction' }

      recordEvent(testData)

      expect(TagManager.dataLayer).toHaveBeenCalledWith({
        dataLayer: testData,
      })
    })
  })

  describe('recordEventOnce', () => {
    beforeEach(() => {
      window.dataLayer = []
    })

    it('adds event to dataLayer if not already present based on key', () => {
      const testData = { event: 'testEvent', key: 'uniqueKey' }

      recordEventOnce(testData, 'key')

      expect(TagManager.dataLayer).toHaveBeenCalledWith({
        dataLayer: testData,
      })
    })

    describe('event', () => {
      it('should log the specific event with the given data', () => {
        const eventData = {
          event: 'button_click',
          category: 'UI',
          action: 'click',
        }

        analytics.event(eventData)

        expect(TagManager.dataLayer).toHaveBeenCalledWith({
          dataLayer: eventData,
        })
      })
    })
  })
})
