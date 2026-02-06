/**
 * Default configuration for VA.gov environment parity testing
 *
 * This config is used when no --config option is specified.
 * Per-path thresholds are set based on known differences between environments.
 */

import type { EPTConfig } from './src/config/types.js'

const config: EPTConfig = {
  environments: {
    a: { baseUrl: 'https://www.va.gov' },
    b: { baseUrl: 'https://staging.va.gov' },
  },

  paths: [
    // Homepage - environments are in sync
    { path: '/', diffThreshold: 0.1 },

    // Find a form
    { path: '/forms/', diffThreshold: 24 },

    // Find a location
    { path: '/find-locations', diffThreshold: 1 },

    // Check your claim, decision review, or appeal status
    { path: '/claim-or-appeal-status/', diffThreshold: 37 },

    // Manage your health care with My HealtheVet
    { path: '/health-care/manage-health', diffThreshold: 16 },

    // Get travel pay reimbursement
    { path: '/health-care/get-reimbursed-for-travel-pay/', diffThreshold: 12 },

    // Review your payment history
    { path: '/va-payment-history/', diffThreshold: 13 },

    // Download your benefit letters
    { path: '/records/download-va-letters', diffThreshold: 45 },

    // Review your disability rating
    { path: '/disability/view-disability-rating', diffThreshold: 16 },

    // Manage health appointments
    { path: '/health-care/manage-appointments', diffThreshold: 12 },

    // Verify your school enrollment
    { path: '/education/verify-school-enrollment', diffThreshold: 15 },

    // Check your remaining GI Bill benefits
    {
      path: '/education/check-remaining-post-9-11-gi-bill-benefits',
      diffThreshold: 13,
    },

    // Review or update your dependents
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
