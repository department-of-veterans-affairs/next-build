# Analytics in next-build:

1. Most client-side analytics are handled automatically when using components from the VA Design System.
2. Additional custom events can be managed using Google Tag Manager via [react-gtm-module](https://www.npmjs.com/package/react-gtm-module). See `src/pages/_app.tsx` and `src/lib/analytics` for implementation details.

Existing content-build analytics tags for reference:

- [vagovdev](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/site/assets/js/google-analytics/vagovdev.js)
- [vagovstaging](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/site/assets/js/google-analytics/vagovstaging.js)
- [vagovprod](https://github.com/department-of-veterans-affairs/content-build/blob/main/src/site/assets/js/google-analytics/vagovprod.js)

3. VA.gov participates in the US government’s analytics program. See the data at analytics.usa.gov.

- https://github.com/digital-analytics-program/gov-wide-code

4. Datadog integration coming soon. Some metrics are sent during GHA workflows. Real user monitoring (RUM) and other analytics of that nature still need to be integrated in next-build proper. See: https://www.datadoghq.com/product/real-user-monitoring/
