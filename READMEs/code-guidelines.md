# Code guidelines

## Code style

- code is in these styles (i.e. airbnb, etc)
- install eslint, prettier, typelint etc to your IDE
  - instructions for vscode, IntelliJ, others

## Typedoc

We use [Typedoc](https://typedoc.org/) to automatically generate documentation from our codebase. Typedoc is an extension of JSDoc that allows code documentation in-place through annotations.

At a minimum, if you are creating a component, type, class, etc, you should create a Typedoc annotation explaining what that structure does. Typedoc annotations are of the following formats:

```
/** This is a basic text explanation of what this component does and anything someone might need to know about it. */
/**
 * This comment structure is also respected and probably better for longer annotations.
 */
const myComponent = ({props} => {
  // the component
});
```

Ideally, if you are defining types in particular, an explanation of what each property in the type is for can be helpful. For example:

```
/**
 * An individual story published by a Facility.
 *
 * @see https://prod.cms.va.gov/admin/structure/types/manage/news_story/fields */
export interface NodeNewsStory extends DrupalNode {
  /** The credited author of the story. {@link NodePersonProfile} */
  field_author: NodePersonProfile
  /** The primary story text. */
  field_full_story: FieldFormattedText
  /** Caption for the attached image. */
  field_image_caption: string
  // snip
```

There are JSDoc and Typedoc tags that you can use to augment your annotations:

- [Typedoc tag documentation](https://typedoc.org/guides/doccomments/)
- [JSDoc documentation](https://jsdoc.app/)
