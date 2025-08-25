import { NodeEvent } from '@/types/drupal/node'
import { FieldDateTimeRange } from '@/types/drupal/field_type'
import { getNextEventOccurrences } from './query-utils'

// Mock NodeEvent with minimal required fields for testing
const mockEvent = (title: string, dateTimeRanges: FieldDateTimeRange[]) =>
  ({
    title,
    field_datetime_range_timezone: dateTimeRanges,
  }) as NodeEvent

// Helper to create FieldDateTimeRange objects
const mockRange = (startIsoString: string): FieldDateTimeRange => {
  const startDate = new Date(startIsoString)
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour duration
  return {
    value: startIsoString,
    end_value: endDate.toISOString(),
  } as FieldDateTimeRange
}

describe('getNextEventOccurrences', () => {
  // Base timestamp for tests - January 15, 2024 at noon UTC
  const baseTimestamp = 1705320000 // 2024-01-15T12:00:00Z

  // ISO datetime strings for testing
  const pastDateTime1 = '2024-01-14T12:00:00.000Z' // 1 day before
  const pastDateTime2 = '2024-01-15T11:00:00.000Z' // 1 hour before
  const futureDateTime1 = '2024-01-15T13:00:00.000Z' // 1 hour after
  const futureDateTime2 = '2024-01-16T12:00:00.000Z' // 1 day after
  const futureDateTime3 = '2024-01-17T12:00:00.000Z' // 2 days after

  describe('basic filtering functionality', () => {
    it('should filter out events with no future occurrences', () => {
      const events = [
        mockEvent('Past Event', [
          mockRange(pastDateTime1),
          mockRange(pastDateTime2),
        ]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)

      expect(result).toHaveLength(0)
    })

    it('should include events with future occurrences', () => {
      const events = [
        mockEvent('Future Event', [
          mockRange(futureDateTime1),
          mockRange(futureDateTime2),
        ]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Future Event')
      expect(result[0].field_datetime_range_timezone).toHaveLength(2)
    })

    it('should filter out past occurrences but keep future ones for the same event', () => {
      const events = [
        mockEvent('Mixed Event', [
          mockRange(pastDateTime1),
          mockRange(pastDateTime2),
          mockRange(futureDateTime1),
          mockRange(futureDateTime2),
        ]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)

      expect(result).toHaveLength(1)
      expect(result[0].field_datetime_range_timezone).toHaveLength(2)
      expect(result[0].field_datetime_range_timezone[0].value).toBe(
        futureDateTime1
      )
      expect(result[0].field_datetime_range_timezone[1].value).toBe(
        futureDateTime2
      )
    })
  })

  describe('sorting functionality', () => {
    it('should sort events by earliest occurrence', () => {
      const events = [
        mockEvent('Later Event', [mockRange(futureDateTime3)]),
        mockEvent('Earlier Event', [mockRange(futureDateTime1)]),
        mockEvent('Middle Event', [mockRange(futureDateTime2)]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('Earlier Event')
      expect(result[1].title).toBe('Middle Event')
      expect(result[2].title).toBe('Later Event')
    })

    it('should sort by earliest occurrence even when events have multiple dates', () => {
      const events = [
        mockEvent('Event A', [
          mockRange(futureDateTime2),
          mockRange(futureDateTime3),
        ]),
        mockEvent('Event B', [
          mockRange(futureDateTime1),
          mockRange(futureDateTime3),
        ]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Event B') // Has earlier first occurrence
      expect(result[1].title).toBe('Event A')
    })
  })

  describe('edge cases', () => {
    it('should handle empty events array', () => {
      const result = getNextEventOccurrences([], baseTimestamp)
      expect(result).toHaveLength(0)
    })

    it('should handle events with empty datetime arrays', () => {
      const events = [mockEvent('Empty Event', [])]

      const result = getNextEventOccurrences(events, baseTimestamp)
      expect(result).toHaveLength(0)
    })

    it('should handle events with exactly matching timestamp (should be excluded)', () => {
      const events = [
        mockEvent('Exact Match Event', [mockRange('2024-01-15T12:00:00.000Z')]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)
      expect(result).toHaveLength(0)
    })

    it('should handle events with timestamp one second after cutoff', () => {
      const events = [
        mockEvent('Just After Event', [mockRange('2024-01-15T12:00:01.000Z')]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Just After Event')
    })
  })

  describe('data integrity', () => {
    it('should preserve original event data except for filtered datetime ranges', () => {
      const originalEvent = mockEvent('Test Event', [
        mockRange(pastDateTime1),
        mockRange(futureDateTime1),
      ])

      // Add some custom properties to verify they're preserved
      originalEvent.field_description = 'Test Description'
      originalEvent.field_featured = true

      const result = getNextEventOccurrences([originalEvent], baseTimestamp)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Test Event')
      expect(result[0].field_description).toBe('Test Description')
      expect(result[0].field_featured).toBe(true)
    })

    it('should not mutate original events array', () => {
      const originalEvents = [
        mockEvent('Event 1', [
          mockRange(pastDateTime1),
          mockRange(futureDateTime1),
        ]),
        mockEvent('Event 2', [mockRange(futureDateTime2)]),
      ]

      const originalLength =
        originalEvents[0].field_datetime_range_timezone.length

      getNextEventOccurrences(originalEvents, baseTimestamp)

      // Original array should be unchanged
      expect(originalEvents[0].field_datetime_range_timezone).toHaveLength(
        originalLength
      )
      expect(originalEvents[0].field_datetime_range_timezone[0].value).toBe(
        pastDateTime1
      )
    })
  })

  describe('complex scenarios', () => {
    it('should handle multiple recurring events with mixed past and future dates', () => {
      const events = [
        // Event with mostly past dates, one future
        mockEvent('Mostly Past', [
          mockRange(pastDateTime2),
          mockRange(pastDateTime1),
          mockRange(futureDateTime3),
        ]),
        // Event with only future dates
        mockEvent('All Future', [
          mockRange(futureDateTime1),
          mockRange(futureDateTime2),
        ]),
        // Event with only past dates (should be filtered out)
        mockEvent('All Past', [
          mockRange(pastDateTime1),
          mockRange(pastDateTime2),
        ]),
      ]

      const result = getNextEventOccurrences(events, baseTimestamp)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('All Future') // Earlier first occurrence
      expect(result[1].title).toBe('Mostly Past')

      // Verify filtered datetime ranges
      expect(result[0].field_datetime_range_timezone).toHaveLength(2)
      expect(result[1].field_datetime_range_timezone).toHaveLength(1)
      expect(result[1].field_datetime_range_timezone[0].value).toBe(
        futureDateTime3
      )
    })
  })
})
