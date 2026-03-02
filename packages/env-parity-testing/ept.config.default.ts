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
    { path: '/' },
    { path: '/forms/' },
    { path: '/find-locations', diffThreshold: 1 },
    {
      path: '/claim-or-appeal-status/',
      // waitForSelector: '.va-alert-sign-in__body',
    },
    { path: '/health-care/manage-health' },
    { path: '/health-care/get-reimbursed-for-travel-pay/' },
    { path: '/va-payment-history/' },
    { path: '/records/download-va-letters' },
    { path: '/disability/view-disability-rating' },
    { path: '/health-care/manage-appointments' },
    { path: '/education/verify-school-enrollment' },
    {
      path: '/education/check-remaining-post-9-11-gi-bill-benefits',
    },
    { path: '/view-change-dependents', diffThreshold: 11 },
  ],

  execution: {
    concurrency: 13,
    failFast: false,
  },

  visual: {
    diffThreshold: 0.1, // Default for paths without specific threshold
  },
}

export default config
