import {
  formatDateObject,
  deriveMostRecentDate,
  deriveFormattedTimestamp,
  isEventInPast,
} from './util'

describe('Util functions', () => {
  describe('formatDateObject', () => {
    it('should add startTime, endTime, value, and endValue to each date object', () => {
      const datetimeRange = [
        {
          value: new Date('2023-09-07T14:00:00Z'),
          end_value: new Date('2023-09-07T16:00:00Z'),
        },
      ]
      const result = formatDateObject(datetimeRange)
      expect(result[0]).toHaveProperty('startTime')
      expect(result[0]).toHaveProperty('endTime')
      expect(result[0]).toHaveProperty('value')
      expect(result[0]).toHaveProperty('endValue')
    })
  })

  describe('deriveMostRecentDate', () => {
    it('should return the closest future event', () => {
      const mockCurrentTime = new Date('2023-08-01T12:00:00Z').getTime()
      jest.spyOn(Date, 'now').mockImplementation(() => mockCurrentTime)

      const datetimeRange = [
        { value: new Date('2023-07-01T14:00:00Z').getTime() / 1000 }, // Past event
        { value: new Date('2023-09-01T14:00:00Z').getTime() / 1000 }, // Closest future event
        { value: new Date('2023-10-01T14:00:00Z').getTime() / 1000 }, // Later future event
      ]

      const closestEvent = deriveMostRecentDate(datetimeRange)
      expect(closestEvent.value).toEqual(datetimeRange[1].value)

      jest.restoreAllMocks()
    })

    it('should return the most recent past event if no future events', () => {
      const mockCurrentTime = new Date('2023-12-01T12:00:00Z').getTime()
      jest.spyOn(Date, 'now').mockImplementation(() => mockCurrentTime)

      const datetimeRange = [
        { value: new Date('2023-07-01T14:00:00Z').getTime() / 1000 }, // Earlier past event
        { value: new Date('2023-11-01T14:00:00Z').getTime() / 1000 }, // Most recent past event
      ]

      const closestEvent = deriveMostRecentDate(datetimeRange)
      expect(closestEvent.value).toEqual(datetimeRange[1].value)

      jest.restoreAllMocks()
    })
  })

  describe('deriveFormattedTimestamp', () => {
    it('should correctly format the event timestamp', () => {
      const datetime = {
        startTime: new Date('2023-09-07T14:00:00Z'),
        endTime: new Date('2023-09-07T16:00:00Z'),
      }
      const result = deriveFormattedTimestamp(datetime)
      expect(result).toMatch('Thu, Sep 7, 2023, 10:00 AM EDT – 12:00 PM EDT')
    })
  })

  describe('isEventInPast', () => {
    it('should return true for past events', () => {
      const pastEventTime = new Date('2020-01-01').getTime() / 1000
      expect(isEventInPast(pastEventTime)).toBeTruthy()
    })

    it('should return false for future events', () => {
      const futureEventTime = new Date('2099-01-01').getTime() / 1000
      expect(isEventInPast(futureEventTime)).toBeFalsy()
    })
  })
})
