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

The templates in next-build are functional React components.
