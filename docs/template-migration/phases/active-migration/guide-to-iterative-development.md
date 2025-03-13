# How to migrate a page template in chunks

## Goal

Follow these steps to migrate a page template in manageable chunks. This will
allow you to incrementally build and test the template, making it easier to
develop and deploy your work.

> [!NOTE] This is for _page_ templates
> While most of these steps are probably applicable to other content types, this
> guide is specifically for migrating entire pages.

## Process

Each of the following steps can be done in a separate PR:

1. [Run the generator](../../../../READMEs/generators.md) to scaffold the
   plumbing to fetch the content type and render the page: `yarn plop`
   - The goal here is to render a (functionally) blank page
   - It'll require you to fix up some linting and type errors
   - Don't forget to add the resource (content) type to `PAGE_RESOURCE_TYPES`
     and render it in [`ResourcePage`](../../../../src/pages/[[...slug]].tsx)
1. Scaffold the structure of the template
   - Find the template in `content-build` and copy over the tags that won't
     change (e.g. the `<div>`s, `<h1>`, etc.)
   - Fill in the parts that require actual thought with placeholders
     - This will be basically anything in `{% these template curly braces %}`
       or `{{ these template curly braces }}`
     - Your placeholders can look like `<div>TODO: Location and contact information</div>`
   - If there are easy pickings like `title` and `fieldIntroText`, use your
     discretion for if you want to include them as well; the general rule here is
     that if there's any logic to figure out _what_ or _how_ to display the
     information, or if it'll require any entity hydration, don't include it yet
1. Write tickets for each of those placeholders
1. Tackle each ticket in a separate PR
   - By now, each ticket should be a small, self-contained piece of work that
     can be tested and QA'd independently
   - Once all the tickets are done, the template is done!

## How to fill in the placeholders

1. Create a component in a module sibling to the template file
1. Write tests for the component
1. Pull in any extra data you may need for the feature
   - If it requires a hydrated entity:
     1. Add the hydrated entity type to the property for the entity's static
        type in [`src/types/drupal/node.ts`](../../../../src/types/drupal/node.ts)
     1. Add the formatted property type to the static property in its module
        in [`src/types/types/formatted/`](../../../../src/types/formatted/)
     1. Add the property to its `formatter` function in
        [`src/data/queries/`](../../../../src/data/queries/)
1. Use it in the template
1. Write a smoke test for it in the template (mostly to make sure that we're
   passing the correct data to it)

> [!IMPORTANT] Pro tip
> This component should ideally adhere to the
> [Law of Demeter](https://ctrlshift.dev/understanding-the-law-of-demeter-the-principle-of-least-knowledge/)
> and [Interface Segregation Principle](https://reflectoring.io/interface-segregation-principle/)
>
> Said another way: Only pass it the information it needs as top-level
> props, not the entire entity. It'll be more reusable that way later if we
> need it.
