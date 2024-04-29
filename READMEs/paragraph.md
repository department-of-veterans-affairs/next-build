# Paragraph Component

## Background

The paragraph component is located at [src/templates/components/paragraph/index.tsx](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/templates/components/paragraph/index.tsx) with corresponding tests located at [src/templates/components/paragraph/index.test.tsx](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/templates/components/paragraph/index.test.tsx).

The primary purpose of this component is to create an abstraction for paragraphs. Drupal nodes can come with fields that may include a collection of paragraphs of no particular type. In order to account for this and cleanly render paragraphs when it isn't necessarily specified what kind of paragraph structure can be expected, the paragraph component was created.

## Paragraph Component Functionality

At a high level, this is simply a switch case that takes in a Drupal paragraph as an object with a type key and returns the corresponding paragraph for that type.

## Format Paragraph Functionality

Located at [src/lib/drupal/paragraphs.ts](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/lib/drupal/paragraphs.ts), the `formatParagraph` function is an abstraction for calling `queries.formatData` that removes the need to explicitly pass the paragraph type as a parameter, since that property should always be available on the paragraph itself. This method allows us to circumvent some type assertion issues that would otherwise arise by simply calling `queries.formatData(paragraph.type, paragraph)`.

## Example

The `qaParagraph` component and its corresponding Drupal paragraph type, `paragraph--q_a`, make a good example of the Paragraph component in use. In [src/mocks/qaParagraph.mock.json](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/mocks/qaParagraph.mock.json), observe that the `field_answer` field has a `paragraph--wysiwyg` reference in it. However, if you look up the Q&A paragraph type in Drupal - [https://staging.cms.va.gov/admin/structure/paragraphs_type/q_a/fields](https://staging.cms.va.gov/admin/structure/paragraphs_type/q_a/fields) - you can see that the `field_answer` field could be Rich text, Accordion group, Process list, Number callout, Alert, React Widget, or Table paragraph types.

In [src/data/queries/qaParagraph.ts](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/data/queries/qaParagraph.ts), the `qaParagraph` formatter defines the `answers` key so that the array of `field_answers` is passed through `formatParagraph` and typed as `FormattedParagraph[]`. This data is then able to be used in the `qaParagraph` component by mapping over the array of formatted paragraphs and calling the paragraph component for each.

```jsx
<div>
  {answers.map((answer, index) => {
    return <Paragraph key={index} {...answer} />
  })}
</div>
```

In the test file for qaParagraphs, you can observe and quicky test that any content type could be passed into that answers array and render the expected output.
