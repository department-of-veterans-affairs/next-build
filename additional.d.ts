/// <reference types="react-scripts" />

declare module 'nock'
declare module 'test-utils'
declare module '@testing-library/react'
declare module '@department-of-veterans-affairs/component-library'
declare module '@department-of-veterans-affairs/component-library/Table'
declare module '@department-of-veterans-affairs/component-library/LoadingIndicator'
declare module '@department-of-veterans-affairs/component-library/AlertBox'
declare module '@department-of-veterans-affairs/component-library/DropDownPanel'
declare module '@department-of-veterans-affairs/component-library/Breadcrumbs'
declare module '@department-of-veterans-affairs/component-library/Banner'
declare module '@department-of-veterans-affairs/component-library/TextInput'
declare module '@department-of-veterans-affairs/component-library/TextArea'
declare module '@department-of-veterans-affairs/component-library/Modal'
declare module '@department-of-veterans-affairs/component-library/Pagination'
declare module '@department-of-veterans-affairs/component-library/ProgressButton'
declare module '@department-of-veterans-affairs/component-library/PromoBanner'
declare module '@department-of-veterans-affairs/component-library/dist/react-bindings'
declare module 'mq-polyfill'
declare module 'debug'

declare namespace JSX {
  interface IntrinsicElements {
    'va-alert'
    'va-link'
    'va-icon'
    'va-button'
    'va-breadcrumbs'
    'va-accordion'
    'va-accordion-item'
    'va-on-this-page'
    'va-back-to-top'
  }
}
