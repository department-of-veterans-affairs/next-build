# How to migrate a page template in chunks

## Why Migrate Incrementally?

Follow these steps to migrate a page template in manageable chunks. This will
allow you to build the template in bite-sized pieces, giving you a range of
benefits:

- **Smaller PRs are easier to review and merge faster**
  - Large PRs are overwhelming and take longer to review
  - Smaller changes reduce the risk of hidden bugs slipping through
- **Incremental changes make debugging easier**
  - If something breaks, you only have to check the latest change, not an entire
    rewrite
  - This helps catch regressions early
- **Each feature (component) is standalone**
  - Features can be tested in isolation
  - Components can be developed in parallel, speeding up delivery
- **Less risk of project delays or blockers**
  - A single large PR can get stuck waiting for approval, delaying everything
  - Smaller PRs keep progress moving and allow for adjustments along the way
- **A clear roadmap helps with estimation and communication**
  - Breaking down the work gives a clearer sense of effort required
  - Stakeholders get regular updates and can course-correct if needed

> [!NOTE]
> This is for _page_ templates.
>
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
1. Define the static types and mock data
   - Use the API Explorer to get the data you need for the mock data
   - Use that mock data to define the static types (ignore entity references for
     now)
     - The input (Drupal) type goes in [`src/types/drupal/node.ts`](../../../../src/types/drupal/node.ts)
     - The output (formatted) type goes in the component folder as `formatted-type.ts`
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
1. Add the Feature toggle for Tugboat
   - In the [Tugboat .env file](https://github.com/department-of-veterans-affairs/next-build/blob/main/envs/.env.tugboat), add the correct feature toggle so that the new template will build and be able to be QA’ed on tugboat.
   - If you need to find the exact name of the feature toggle, they can be found within Drupal admin: /admin/config/system/feature_toggle
1. For each of the placeholders in the scaffold, there should already be tickets written as subissues of the larger, parent migration ticket
1. Tackle each ticket in a separate PR
   - By now, each ticket should be a small, self-contained piece of work that
     can be tested and QA'd independently
   - Once all the tickets are done, the template is done!

## How to fill in the placeholders

1. Create a component in the same component folder as the template file
1. Write tests for the component
1. Pull in any extra data you may need for the feature
   - If it requires a hydrated entity:
     1. Add the hydrated entity type to the property for the entity's static
        type in [`src/types/drupal/node.ts`](../../../../src/types/drupal/node.ts)
     1. Add the formatted property type to the static property in its module
        in the component folder as `formatted-type.ts`
     1. Add the property to its `formatter` function in the component folder as `query.ts`
1. Use it in the template
1. Write a smoke test for it in the template (mostly to make sure that we're
   passing the correct data to it)

> [!IMPORTANT]
> Pro tip: This component should ideally adhere to the
> [Law of Demeter](https://ctrlshift.dev/understanding-the-law-of-demeter-the-principle-of-least-knowledge/)
> and [Interface Segregation Principle](https://reflectoring.io/interface-segregation-principle/)
>
> Said another way: Only pass it the information it needs as top-level
> props, not the entire entity. It'll be more reusable that way later if we
> need it.

## Common pitfalls and lessons learned

### Type definition issues

- **Entity Relationships**: Complex templates often reference multiple entity types. You may need to define additional node types (like `NodeVetCenterMobileVetCenter`) for related entities.
- **PublishedEntity Base**: Many formatted types should extend `PublishedEntity` to get common fields like `entityId`, `entityPath`, `breadcrumbs`, etc.

### Data query complexity

- **Reverse relationships**: Some templates use reverse entity relationships (like `reverseFieldOfficeNode`). These may require additional query logic or separate data fetching.
- **Conditional includes**: Be selective about what you include in your initial query. Start with the basics and add more includes as needed for specific components.
- **Reusable data transformation**: Complex templates often have nested entities that already have formatting functions defined. Consider reusing those when possible.

### Template structure

- **Common components**: Look for existing components you can reuse (like `ContentFooter`, `va-link`, `va-back-to-top`) before creating new ones.
- **CSS classes**: Preserve the original CSS classes from the liquid template to maintain styling consistency. In the case of v3 grid migration, get to parity with production first and then work on migrating from there.
- **Accessibility**: Ensure your placeholders and final components maintain accessibility features from the original template.

### Resource type naming

- **Consistent naming**: Use consistent naming conventions for resource types. The generator may create camelCase names, but you should use SCREAMING_SNAKE_CASE for constants.
- **Content type matching**: Ensure the resource type string matches the actual Drupal content type (e.g., `node--vet_center_locations_list`).

### Testing sStrategy

- **Snapshot tests**: Use snapshot tests for data formatting to catch unexpected changes.
- **Component tests**: Write tests for individual components as you build them.
- **E2E tests**: Update the generated Playwright tests with actual URLs and test scenarios.
