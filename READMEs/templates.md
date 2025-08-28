# Templates

Front end templates are organized in a co-located structure under `src/components`. Each component folder contains all related files for that feature, including the main React component (template), types, queries, mocks, and tests.

## Component Organization

Components are now organized as follows:

- `src/components/<component-name>/`: Each component has its own folder containing all related files
  - `template.tsx`: The main component for a template
  - `template.test.tsx`: Jest test file for a template
  - `query.ts`: Data query logic for fetching and formatting data
  - `query.test.ts`: Test file for the query logic
  - `formatted-type.ts`: Type definitions for the component's data structure
  - `mock.json`: Mock data for testing
  - Additional component-specific files as needed

## Template Structure & Types

The templates in next-build are functional React components. The types or interfaces for a component are now co-located in the same folder as the component (`formatted-type.ts`). This helps ensure that data formatted by a query matches the shape the front end component expects, and keeps all related code together for easier maintenance.

## Template List

Developers are required to update this section when adding or updating a layout.

| Layout                 | Example                                                                                                                                           | Status      |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :---------- |
| Event                  | [Link](https://dev.va.gov/outreach-and-events/events/69619/)                                                                                      | QA - Design |
| Event Listing          | [Link](https://dev.va.gov/outreach-and-events/events/)                                                                                            | QA - Design |
| News Story             | [Link](https://dev.va.gov/eastern-oklahoma-health-care/stories/access-va-health-care-during-federal-holidays-and-247-365-with-va-health-connect/) | QA - AP     |
| Press Release          | [Link](https://dev.va.gov/southern-nevada-health-care/news-releases/vasnhs-to-host-laughlin-pact-act-veterans-town-hall-june-27/)                 | QA - AP     |
| Press Release Listings | [Link](https://dev.va.gov/southern-nevada-health-care/news-releases)                                                                              | QA - AP     |
| Story Listings         | [Link](https://dev.va.gov/eastern-oklahoma-health-care/stories/)                                                                                  | QA - AP     |
| Vets Center            | [Link](https://dev.va.gov/des-moines-vet-center/)                                                                                                 | QA - AP     |
| Step By Step           | N/A                                                                                                                                               | Planning    |
