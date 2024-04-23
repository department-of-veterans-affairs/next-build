# Typescript in `next-build`

## Introduction

This application (`next-build`) is primarily written in [Typescript](https://www.typescriptlang.org/), a strongly typed language based on Javascript that gives us better tooling for writing intentional, error-free code. Typescript is compiled to standard Javascript as part of the build process, so what is delivered to the browser is always Javascript that will run on all browsers and devices we support.

## Types

Typescript provides [basic types](https://www.typescriptlang.org/docs/handbook/basic-types.html) that form the building blocks for more complex, application-specific types, and it's critical that engineers working on this project have a strong grasp of these fundamentals before proceeding. In this document, we'll focus on the more complex types that are specific to our application. Importantly, we'll examine them from the context of the application architecture that gives rise and meaning to the types in question.

The salient pieces of that application architecture can be summarized via the following steps through which data flows in our application:

1. Data entities are fetched from **Drupal**.
2. Data entities are transformed into standardized **formatted** data structures.
3. Formatted data entities are passed to **components** (templates).

### Drupal data types

As we follow the data flow through the steps outlined above, the first important piece of the flow is fetching data from our CMS, in this case Drupal. In order to reap the benefits of strongly typed programming, we need to be able to define types for all of the possible data structures that Drupal might give us (e.g. News Story, Event, etc.)

Fortunately, we have some additional building blocks at our disposal for defining each of these types. `next-build` is built on top of [Next.js for Drupal](https://next-drupal.org/) (`next-drupal`) - which is also written in Typescript - and `next-drupal`[provides a number of types](https://github.com/chapter-three/next-drupal/blob/main/packages/next-drupal/src/types.ts) for standard Drupal data structures. For example, `next-drupal` defines a type `DrupalNode` which provides a defined structure that is shared by any node data. Our defined types for our Drupal nodes extend this basic type, adding information about the specific fields the node makes use of. The News Story node provides a good example:

```
export interface NodeNewsStory extends DrupalNode {
  field_author: NodePersonProfile
  field_full_story: string
  field_image_caption: string
  field_featured: boolean
  field_intro_text: string
  field_media: DrupalMediaImage
  field_order: number
  field_listing: NodeStoryListing
  field_administration: FieldAdministration
  created: string
  field_last_saved_by_an_editor?: string | null
}
```

We should note especially in the above snippet the `extends DrupalNode` syntax. This demonstrates our types extending from base types provided by `next-drupal`. `DrupalNode` is just one example. Another "entity" - what Drupal calls a data object with a defined structure - is `DrupalParagraph`. An example of a paragraph in our application is a Button:

```
export interface ParagraphButton extends DrupalParagraph {
  field_button_label: string
  field_button_link: FieldLink
}
```

Again, note the `extends DrupalParagraph` syntax. There are still other entity types as well (e.g. taxonomy term, media, block, menu entity). Every time we are working with a Drupal entity, there should be a type definition for that entity. Drupal itself defines types for these entities, and the types we use in `next-build` should reflect Drupal's structures. These should all be typed within `next-build` by extending the basic types provided by `next-drupal`.

### Formatted data types

One thing that stands out when looking at the type definitions above is some very Drupal-specific field naming (e.g. `field_image_caption`). For two main reasons, we'd rather not deal with that naming pattern:

1. The names are a mouthful and require a lot of excess key strokes.
2. We don't want our business logic tightly coupled with the specific CMS instance. One good rule of thumb for achieving loose coupling with the CMS is to structure things so that the CMS could be swapped out.

So, acknowledging those two considerations, the next key step in our process is converting these data structures into a standardized format. We shorten the names and make them CMS agnostic. Throughout this applicaion, we refer to these types as our "formatted" types. The best way to demonstrate this is to look at the corresponding examples to what we saw above:

```
export type NewsStory = PublishedEntity & {
  image: MediaImage
  caption: string
  author: PersonProfileTeaserProps
  introText: string
  bodyContent: string
  date: string
  socialLinks: SocialLinksProps
  listing: string
  administration: Administration
}
```

```
export type Button = PublishedParagraph & {
  type: 'paragraph--button'
  label: string
  url: string
}
```

It's useful to point out here that we have a mixture of `type` and `interface` definitions throughout this repo. That is likely not a perfect setup, as there is an argument for keeping them consistent, but it's not a huge problem in practice.

More to these definitions themselves, it's also useful to point out that our formatted types generally extend base types like `PublishedEntity` or `PublishedParagraph` (very similarly to how our Drupal types extend a base type like `DrupalNode` or `DrupalParagraph`).

A final note here is that when these types are imported into a file where a component of the same name exists, we alias the type so as to not conflict with the name of the component itself. Here is one example:

```
import { NewsStory as FormattedNewsStory } from '@/types/formatted/newsStory'
```

The biggest takeaway is that from this point forward, our business logic can reference, for example, `caption` rather than `field_image_caption`. Again, this is easier to type and, importantly, less tightly coupled with our CMS.

### Component data types

The final step in our application's data flow is to pass the formatted/standardized data structure to its corresponding template for rendering as HTML. For the most part, the format expected by the templates is the exact same as the formatted structure explained just above. However, there is a caveat.

To explain that caveat, let's first step back and recall that our formatted types generally extend a base type like `PublishedEntity` or `PublishedParagraph`. It's useful to take a look at these base types:

```
export interface PublishedEntity {
  id: string
  type: string
  published: boolean
  title: string
  entityId?: number
  entityPath?: string
  moderationState?: string
  breadcrumbs?: BreadcrumbItem[]
  metatags?: MetaTag[]
  lastUpdated: string
}

export interface PublishedParagraph {
  id: string
  type: string
  entityId?: number
}
```

Specifically, we see in both types the existence of a property named `type`. This field is necessary during the earlier steps of the process when we need to know what type of data an object represents. The most notable reason for needing that property is so that we can call the appropriate template (this step) to render the data in question. But once we're in the template itself, `type` becomes superfluous. As such, we have some mechanisms in place to not require this field in paragraph templates. The below example demonstrates this:

```
export type ParagraphComponent<T> = Omit<T, 'type'> & {
  type?: ParagraphResourceType
}
```

```
export function Button({ id, label, url }: ParagraphComponent<FormattedButton>) {
 ...
}
```

Essentially, this changes `type` to an optional property so that it doesn't need to be present to call the component itself. Without this accommodation, the component call is a bit redundant:

```
  <Button
    type="paragraph--button"
    id="1"
    label="This is a button"
    url="https://somesite.org/some/path"
  />
```

This feels better:

```
  <Button
    id="1"
    label="This is a button"
    url="https://somesite.org/some/path"
  />
```

Notably, this accommodation is only in place for paragraph types. It is not in place for our node types. It's not strictly necessary, but it is technically more accurate. **Going forward, it might make sense to align these approaches.** Either remove this work around paragraphs, or add it in for node type handling.

### Other types

Engineers are encouraged to write types for any data structures that will be used within `next-build`. Use judgement, but in general, if a data structure is exported from a component or other module, to be used elsewhere, it should be typed.

## Development configuration

Typescript configuration is contained at the root of the repo at [tsconfig.json](https://github.com/department-of-veterans-affairs/next-build/blob/main/tsconfig.json). This provides information to Typescript tooling for knowing how to find Typescript files, how these should be compiled to JS at build time, etc.

[VSCode provides Typescript support by default](https://code.visualstudio.com/docs/languages/typescript). This can be extended and configured as desired.

IntelliJ setup @todo.

Other IDEs @todo, as needed.
