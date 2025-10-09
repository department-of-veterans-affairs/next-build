/**
 * Utility functions for Benefits Hub components
 */

import clsx from 'clsx'

interface HubIconData {
  icon: string
  backgroundColor: string
}

interface HubIconConfig {
  icon: string
  backgroundColor: string
  className: string
}

/**
 * Hub icon configuration with icon names and background colors
 */
const hubIcons: Record<string, HubIconData> = {
  'health-care': {
    icon: 'medical_services',
    backgroundColor: 'hub-health-care',
  },
  careers: {
    icon: 'work',
    backgroundColor: 'hub-careers',
  },
  'life-insurance': {
    icon: 'shield',
    backgroundColor: 'hub-life-insurance',
  },
  'service-member': {
    icon: 'flag',
    backgroundColor: 'hub-service-member',
  },
  disability: {
    icon: 'description',
    backgroundColor: 'hub-disability',
  },
  pension: {
    icon: 'handshake',
    backgroundColor: 'hub-pension',
  },
  burials: {
    icon: 'star',
    backgroundColor: 'hub-burials',
  },
  'family-member': {
    icon: 'groups',
    backgroundColor: 'hub-family-member',
  },
  education: {
    icon: 'school',
    backgroundColor: 'hub-education',
  },
  housing: {
    icon: 'home',
    backgroundColor: 'hub-housing',
  },
  records: {
    icon: 'identification',
    backgroundColor: 'hub-records',
  },
  'va-dept-info': {
    icon: 'location_city',
    backgroundColor: 'primary-darker',
  },
}

/**
 * Gets hub icon configuration for styling va-icon web component
 *
 * @param titleIcon - The hub key from the CMS (e.g. "disability", "health-care")
 * @param additionalClasses - Additional CSS classes to apply
 * @returns Configuration object for the styled hub icon, or null if no mapping exists
 */
export function getHubIcon(
  titleIcon?: string,
  additionalClasses: string = ''
): HubIconConfig | null {
  if (!titleIcon) return null

  const hubData = hubIcons[titleIcon]
  if (!hubData) return null

  const className = clsx(
    'hub-icon',
    'vads-u-color--white',
    `vads-u-background-color--${hubData.backgroundColor}`,
    'vads-u-display--flex',
    'vads-u-align-items--center',
    'vads-u-justify-content--center',
    additionalClasses
  )

  return {
    icon: hubData.icon,
    backgroundColor: hubData.backgroundColor,
    className,
  }
}
