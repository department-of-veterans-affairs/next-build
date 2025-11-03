import { secondsToDurationLabel } from './time'

describe('secondsToMinuteLabel', () => {
  it('shows < 60 seconds as "N seconds" label', () => {
    expect(secondsToDurationLabel(12)).toBe('12 seconds')
    expect(secondsToDurationLabel(51)).toBe('51 seconds')
    expect(secondsToDurationLabel(30)).toBe('30 seconds')
  })

  it('shows < 60 minutes as "M:SS minutes"', () => {
    expect(secondsToDurationLabel(60)).toBe('1:00 minutes')
    expect(secondsToDurationLabel(65)).toBe('1:05 minutes')
    expect(secondsToDurationLabel(3333)).toBe('55:33 minutes')
    expect(secondsToDurationLabel(650)).toBe('10:50 minutes')
  })

  it('shows >= 60 minutes as "H:MM hours"', () => {
    expect(secondsToDurationLabel(3600)).toBe('1:00 hours')
    expect(secondsToDurationLabel(3670)).toBe('1:01 hours')
    expect(secondsToDurationLabel(4500)).toBe('1:15 hours')
    expect(secondsToDurationLabel(5400)).toBe('1:30 hours')
  })
})
