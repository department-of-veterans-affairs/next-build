# Templates

Front end templates are stored at `src/templates`. Templates are divided into the following subdirectories:

- `src/templates/common`: reusable UI elements, i.e. pagers, links, images, or components that are used site-wide (breadcrumbs). Generally smaller components, but not always (header, footer)
- `src/templates/components`: small units with specific content functions. In Drupal these would correspond to Paragraphs and to smaller representations of content, i.e. a News Story Teaser that would be repeated on a Listing Page.
- `src/templates/layouts`: full page displays or page wrappers.

No matter the template category, it should have at least three files:

1. `index.tsx`: The main component for a template
2. `index.test.tsx`: Jest test file for a template
3. `<template>.stories.ts`: Storybook file for a template

With these three files, we can ensure that a given template has adequate test coverage and can be viewed or tested in isolation in Storybook.

## Template Structure & Types

The templates in next-build are functional React components. The types or interfaces for a component will likely come from the `@/types/formatted/` directory. This helps ensure that data formatted by a query matches the shape the front end component expects.

## Available Template List

Developers are required to update this section when adding a new layout.
The following layouts are available in next-build.

- (Event) [http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com/outreach-and-events/events/69619/]
- (Event Listings) [http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com/outreach-and-events/events/]
- (News Story) [http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com/eastern-oklahoma-health-care/stories/access-va-health-care-during-federal-holidays-and-247-365-with-va-health-connect/]
- (Press Release) [http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com/southern-nevada-health-care/news-releases/vasnhs-to-host-laughlin-pact-act-veterans-town-hall-june-27/]
- (Press Release Listings) [http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com/southern-nevada-health-care/news-releases]
- (Story Listings) [http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com/eastern-oklahoma-health-care/stories/]
- (Vets Center) [http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com/abilene-vet-center]
