/**
 * @jest-environment node
 */

import { getHubIcon, getHubIconName } from './benefitsHub'

describe('getHubIcon', () => {
  test('returns correct icon configuration for valid hub keys', () => {
    const healthCareIcon = getHubIcon('health-care', '3')
    expect(healthCareIcon).toEqual({
      icon: 'medical_services',
      backgroundColor: 'hub-health-care',
      className:
        'hub-icon vads-u-color--white vads-u-background-color--hub-health-care vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center',
    })

    const disabilityIcon = getHubIcon('disability')
    expect(disabilityIcon).toEqual({
      icon: 'description',
      backgroundColor: 'hub-disability',
      className:
        'hub-icon vads-u-color--white vads-u-background-color--hub-disability vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center',
    })
  })

  test('includes additional classes when provided', () => {
    const icon = getHubIcon('education', '2', 'custom-class another-class')
    expect(icon?.className).toContain('custom-class another-class')
  })

  test('returns null for invalid hub keys', () => {
    expect(getHubIcon('Invalid Type')).toBe(null)
    expect(getHubIcon('random text')).toBe(null)
    expect(getHubIcon('Health care')).toBe(null) // expects hub key, not display name
  })

  test('returns null for undefined, null, or empty input', () => {
    expect(getHubIcon(undefined)).toBe(null)
    expect(getHubIcon('')).toBe(null)
  })

  test('uses default icon size when not provided', () => {
    const icon = getHubIcon('housing')
    expect(icon).toBeTruthy()
    // Icon size is not in the returned config, it's passed to the component
  })
})

describe('getHubIconName (legacy)', () => {
  test('returns correct icon name for valid hub keys', () => {
    expect(getHubIconName('health-care')).toBe('medical_services')
    expect(getHubIconName('disability')).toBe('description')
    expect(getHubIconName('education')).toBe('school')
    expect(getHubIconName('records')).toBe('identification')
    expect(getHubIconName('careers')).toBe('work')
    expect(getHubIconName('pension')).toBe('handshake')
    expect(getHubIconName('housing')).toBe('home')
    expect(getHubIconName('life-insurance')).toBe('shield')
    expect(getHubIconName('burials')).toBe('star')
    expect(getHubIconName('family-member')).toBe('groups')
    expect(getHubIconName('service-member')).toBe('flag')
  })

  test('returns null for invalid hub keys', () => {
    expect(getHubIconName('Invalid Type')).toBe(null)
    expect(getHubIconName('random text')).toBe(null)
    expect(getHubIconName('Health care')).toBe(null) // expects hub key, not display name
  })
})
