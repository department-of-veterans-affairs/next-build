# Quickstart

This goal of this document is to be used as a reference sheet to quickstart developing the frontend of next-build. It should be used as a reminder of common steps in the development process and redirect you to the relating documentation for more in-depth understanding.

## Recommended READMEs to start with

- [generators.md](READMEs/generators.md) : Read to understand how to quickly generate layout, component, and query templates
- [queries.md](READMEs/quickstart.md) : Read to understand the database queries or search parameters that are being used in your project, as this file typically contains information or documentation related to database interactions.
- [templates.md](READMEs/templates.md) : Read to understand the structure and organization of front-end templates in the src/templates directory, including their categorization, required files, and usage of React components and types.
- [typescript.md](READMEs/typescript.md) : Read to understand how Typescript is used in the next-build application, including the structure and usage of specific types, the flow of data through the application, and how to configure Typescript for development. It also provides insights into the application's architecture and the rationale behind certain design decisions.
- [testing.md](READMEs/testing.md) : Read to understand the testing procedures.
- [[...slug.md]]() : Read to understand how next-build handles page routing and the history and thought process to its decision.
- [preview.md](READMEs/preview.md) : Recommended README for preview issue during setup
  The rest of the available READMEs relating to information occuring in the background in which a developer won't be actively working on day-to-day,used for specific scenarios, or to make development easier but not impossible to do without.

---

## Setting up the environment

[Link to environment setup documentation](https://github.com/department-of-veterans-affairs/next-build/tree/main?tab=readme-ov-file#next-build)
A video walkthrough should be available to assist in setting up.

### Next-Build walkthrough setup

> [!IMPORTANT]
> In order for next-build to have access to drupal data, safely acquire the `DRUPAL_CLIENT_ID` and the `DRUPAL_CLIENT_SECRET` from AWS SSM or someone with access to those values to implement in your env.local file.
>
> ```
> DRUPAL_CLIENT_ID=Retrieve this from AWS SSM /cms/consumers/next-build/client_id
> DRUPAL_CLIENT_SECRET=Retrieve this from AWS SSM /cms/consumers/next-build/client_secret
> ```
>
> [!NOTE]
>
> - Make sure you socks is on with `vtk socks on` if you are not using local CMS preview.
> - Without socks on, you won't be able to view tugboat, which is another area of testing that occurs after making a pull request. Un able to view tugboat prevents access to tugboats error logs.
> - [Mac installation for sock](https://vfs.atlassian.net/wiki/spaces/~6218e48cc34549007199170b/pages/2178187323/Install+SOCKS+proxy+on+Mac)
> - [Windos installation for socks](https://depo-platform-documentation.scrollhelp.site/getting-started/accessing-internal-tools-via-socks-proxy)

---

## Structure

This is a high-level breakdown of what will the core areas in the repository you will frequently hop between during development.

- Queries
  - In a single query file there are three areas that are often modified
    - Define `query params`
    - Update `data loader`
    - Modify `formatter`
- Template
  - The template refers to a folder with 3 files where the index.ts file is where you inject the formatted data and build the html structure
- Types
  - When generating new layouts, new types will be created and existing types might need to be updated to work with new layouts.

---

## Generating a layout

As listed above, please read [generators.md](READMEs/generators.md)
Next-Build is not involve in the creation of completly new layouts from scratch at the moment. The goal is to translate all of Content-Build's existing layouts into Next-Build.

> [!NOTE]
> Not all generated files are required to be used. It acts as a structured template of what is needed to build a layout.
> When creating a new layout, create a new layout, create a new feature branch from main and use `yarn plop` to generate a layout template. Running this comand will prompt you to choose the type of content you want to generate. The following insctrustion will go through each option.
> [!NOTE]
> Branch naming has not been consistent and had followed the trend of what works best for the team. The AP Team of 2024 followed the naming conventions of `issue_#_(summary of ticket/task)`

- Yarn Plop > Select **Content Type**
  - **Content Type** generate these files
    - Path `src/templates/layouts/`
      - Within `<folder layout name>`
        - `index.ts`
          - Define component and component rendering
        - `index.test.tsx`
          - Test suite for index.ts to pass Jest test and coverage
        - `<layout name>.stories.ts`
          - Help develop component isolation and visually tests its behavior with various input
    - Path `src/types/formatted/<layout name.ts>`
      - Define the object and its properties
    - Path `src/data/queries/<layout name.ts>`
      - Interact with Drupal backend to fetch, format, and handle the data
    - Path `src/data/queries/tests/<layout name.test.tsx>`
      - Jest test file for `<layout name>.tsx` module
    - Path `src/data/queries/tests/snapshots/<layout name.test.tsx.snap>`
      - Automatically generated jest snapshot
      - Compares current output of `formatData` to the snapshot
        > [!TIP] Snapshot may not update immediately and run manual `yarn test -- -u`. Details from [testing.md](READMEs/testing.md)
    - Path `src/mocks/<layout name.mock.json>`
      - Copy and paste one JSON object from Drupal API to be used in Jest tests
    - Path `playwright/tests/<layout name.spec.js>`
      - Test Suite for playwright
- Yarn Plop > Select **Component**
  - This will only generate the component folder `<layout name>` and the realting three files ` index.ts, index.tsx, and <layout name>.stories.ts` under the `component` folder
- Yarn Plop > Select **Query**
  - This will generate query file under the data/queries folder relating test

---

## Development breakdown

Formatting data, updating data, and creating new data types and objects will be the majority of the development time.
This is the suggested order to approach development, to not be overwhelmed with too many error messages. You can develop in any order.

1. Start with api-explorer.ts and your layout query[^1] to set up and format the data that is needed for your layout
   - Api-explorer to see the values Drupal is sending via the JSON:API
     - `yarn dev` to turn localhost on then navigate to [http://localhost:3999/\_playground/api-explorer/](http://localhost:3999/_playground/api-explorer/)
     - Useful for filling out mock.json and traversing through nested values
   - if properties with nested properties are required, utilize the `...getNestedIncludes()` method to traveers through the nested properties in the api-explorer and for your query file's `query param` section.
2. In layout query file[^2]
   - Update the `query params` section with the properties needed for the layout.
   - Update the `data loader` to use the correct `RESOURCE_TYPES`
   - Create more defined fields in the `formatter` and map the data to those fields. The new fields should be refined to hold only the necessary data needed to build your layout and remove the excess data.
3. Setting types the layout's formatted file[^3]
   - A formatted file will generate as a part of the layout template. Here you will need to set the correct data types to the new fields created from the `formatter` in the relating query file[^4]
   - This should resolve any errors relating to type conflicts or error messages claiming that property does not exist in the query file[^5]
4. In the index.tsx file from the layout folder[^6]
   - This is where the layout object is decalred and uses the object's properties made from the `formatter` as arguments to be injects into the html structure to be rendered
     > [!IMPORTANT] Try to use va-components whenever possible. The va-components are imported to next build and exist in the `additional.d.ts` file. There will be some instance where va-component, such as content-build is not using the va-component and we must match production as closely as possible or there is a data-widget-type handling the rendering.

---

## Other existing relevant files

- Pagination
  - pageSizes.ts
- Create identifies and Typescript types for resources
  - resourceTypes.ts
- Folder types/drupal contains all the interfaces to extract and extend.
  Folders listed below are likely need to be updated with new interfaces
  - node.ts
  - paragraph.ts
- If content goes to multiple organization levels like news story applies for VA and TRICARE
  - constants.ts
- Helpful files for development
  - api-explorer.tsx
  - [[...slug]].tsx
- Reuse existing field type
  - field_types_d.ts

---

## Passing tests

You won’t be able to commit unless:

- There are no errors
  - Passing threshold must be 80% or above
  - To bypass with intentions to created draft PRs for code help and review you can use the –no-verify with your commit command
- Yarn test will run tests on the entirety of next-build
  Once you commit and push for pull request, a series of tests will run on the pull request
- One of the common points of failed passing is tugboat which will have an error log to view why tugboat failed
  - Our [tugboat ReadME](READMEs/tugboat.md) is brief but should redirect to the VA tugboat doc for more information.

---

## Test commands

- yarn test
- yarn test:format
- yarn test:coverage
- yarn test – -u

---

## Helpful tools and commands

- yarn test:types
  - List files that did not pass typechecks
- yarn test:formatted
  - List files failing to pass Prettier formatting
- yarn test: coverage
  - Shows list of information regarding coverage
  - Passing threshold is 80%
- yarn test — -u
  - Running `yarn test -- -u` will pass the `-u` flag to the underlying jest command being run with `yarn test`
  - Also, updates snapshots in case the test is failing due to conflicting snapshots
- Working around shadow DOMs for Jest testing:
  - Use .innerHTML to check if something is rendered
  - Using the event callbacks bound to the component.\_\_events value

---

## Troubleshooting

- Placing console.log
  - in the catch error section of [[...slug]].tsx can output helpful error messages in your terminal
- Identifying areas to increase passing score for Jest
  - Open coverage/lcov-report/index.html in a browser to find which files and lines that are not being covered

[^1]: Refers to this file `src/data/queries/<layout name.ts>`

[^2]: Refers to this file `src/data/queries/<layout name.ts>`

[^3]: Refers to this file `src/types/formatted/<layout name.ts>`

[^4]: Refers to this file `src/data/queries/<layout name.ts>`

[^5]: Refers to this file `src/data/queries/<layout name.ts>`

[^6]: Refers to files in this folder `src/templates/layouts/<folder layout name>`
