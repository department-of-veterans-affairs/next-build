# Typescript

Next-build is primarily written in [Typescript](https://www.typescriptlang.org/), a strongly typed language based on Javascript that gives us better tooling for writing intentional, error-free code. Typescript is compiled to standard Javascript as part of the build process, so what is delivered to the browser is always Javascript that will run on all browsers and devices we support.

## Types

next-build is built on top of [Next-Drupal](https://next-drupal.org/), which is also written in Typescript. [Next-Drupal provides a number of types](https://github.com/chapter-three/next-drupal/blob/main/packages/next-drupal/src/types.ts) for standard Drupal data structures and also for its internal operations.

### Drupal data types

Every time we are working with a Drupal entity - what Drupal considers a data object with a defined structure - there should be a type definition for that entity. Drupal itself defines types for these entities, and the types we use in next-build should reflect Drupal's structures.

Our Drupal Typescript types should extend the basic types provided by Next-Drupal. For example, Next-Drupal provides a type `DrupalNode` which provides a defined structure that is shared by any node data. Our defined types for our Drupal nodes should extend that basic type, adding information about the specific fields the node makes use of. Example:

```
export type NodeBasicLandingPage = DrupalNode & {
  field_table_of_contents_boolean: boolean
  field_content_block: (
    | ParagraphWysiwyg
    | ParagraphListOfLinks
    | ParagraphTable
    | ParagraphReactWidget
    | ParagraphAlert
  )[]
  field_description: string
  field_meta_title: string
  field_intro_text_limited_html: FieldFormattedText
}
```

Node, paragraph, taxonomy, media, block, and menu entities should all be typed within next-build, and should extend the basic types provided by Next-Drupal.

### Other types

Engineers are encouraged to write types for any data structures that will be used within the next-build. Use judgement, but in general, if a data structure is exported from a component or other module, to be used elsewhere, it should be typed.

For example, each node-specific component exports 'Meta' data which allows its Drupal resource identifier (i.e. `node--news_story`: [Meta information example](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/components/node/news_story/index.tsx#L80)) to be associated with other properties that are needed to maintain it. [This Meta information is imported by the abstract Node component](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/components/node/index.tsx#L19) so that Node is able to associate node data with its appropriate component. [This Meta data is typed](https://github.com/department-of-veterans-affairs/next-build/blob/main/src/components/node/index.tsx#L12) so that we know it contains everything that we will need to make use of the component in question. Without this typed data, the component cannot be discovered and used.

## Development configuration

Typescript configuration is contained at the root of the repo at [tsconfig.json](https://github.com/department-of-veterans-affairs/next-build/blob/main/tsconfig.json). This provides information to Typescript tooling for knowing how to find Typescript files, how these should be compiled to JS at build time, etc.

[VSCode provides Typescript support by default](https://code.visualstudio.com/docs/languages/typescript). This can be extended and configured as desired.

IntelliJ setup @todo.

Other IDEs @todo, as needed.
