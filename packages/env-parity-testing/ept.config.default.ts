/**
 * Default configuration for VA.gov environment parity testing
 *
 * This config specifies OPTIONS for paths, not the paths themselves.
 * The paths to compare are defined in paths/critical.txt (or via --paths).
 *
 * Per-path thresholds are set based on known differences between environments.
 */

import type { EPTConfig } from './src/config/types.js'

const config: EPTConfig = {
  environments: {
    a: { baseUrl: 'https://www.va.gov' },
    b: { baseUrl: 'https://staging.va.gov' },
  },

  // Path-specific options (thresholds, selectors, etc.)
  // Paths not listed here will use global defaults
  paths: [
    { path: '/', diffThreshold: 0.1 },
    { path: '/forms/', diffThreshold: 24 },
    { path: '/find-locations', diffThreshold: 14 },
    { path: '/claim-or-appeal-status/', diffThreshold: 37 },
    { path: '/health-care/manage-health', diffThreshold: 16 },
    { path: '/health-care/get-reimbursed-for-travel-pay/', diffThreshold: 12 },
    { path: '/va-payment-history/', diffThreshold: 13 },
    { path: '/records/download-va-letters', diffThreshold: 45 },
    { path: '/disability/view-disability-rating', diffThreshold: 16 },
    { path: '/health-care/manage-appointments', diffThreshold: 12 },
    { path: '/education/verify-school-enrollment', diffThreshold: 15 },
    {
      path: '/education/check-remaining-post-9-11-gi-bill-benefits',
      diffThreshold: 13,
    },
    { path: '/view-change-dependents', diffThreshold: 10 },
  ],

  execution: {
    concurrency: 4,
    failFast: false,
  },

  visual: {
    diffThreshold: 0.1, // Default for paths without specific threshold
  },
}

export default config
