## Scope and Overview

This is a living document describing the scope, approach, resources, and schedule for the testing activities of the [Next-Build project](https://github.com/department-of-veterans-affairs/next-build/). In it, we'll define our goals, what will be tested, what will be used to test, when and by whom these tests will be executed, and why these choices have been made.

The **Next-Build** project is a new, React-based content build system intended to provide a modern frontend development framework to support the accelerated publishing initiative. There are numerous stakeholders here: frontend engineers, CMS engineers, engineers on other teams, editors, and of course, veterans and caregivers. This project is expected to serve these stakeholders in many ways, and to do so reliably and consistently. Furthermore, the team itself should be confident in what it produces.

Pushing a new commit to the `main` branch implies a statement about quality; that the team has engaged in a reasonable amount of effort to ensure that this new commit doesn't cause any new issues, reintroduce any old ones, violate any standards, flout any best practices, or in any other way introduce new unpleasantness to life or work. This test strategy is geared at helping us achieve and maintain a consistent level of quality through automated tests, the tooling needed for those tests, and following best practices.

This document should be reviewed, edited, and approved by the Next-Build development team prior to any substantial work on tests or the testing infrastructure. It should also be updated to reflect changes in how the team and other contributors approach testing in practice, to acknowledge the inevitable conflicts and special cases that crop up over the lifetime of the project, and as the vision of the project and its concerns evolve.

## Definitions

The following terms are defined as they will be used within this document.

- **Accessibility Testing**: Tests measuring the compliance of the system with various guidelines, standards, and practices aimed at reducing discomfort and maximizing usability and inclusiveness.

- **Behavior-Driven Development**: An approach to development built around specifying behavioral contracts for a system and developing the system to function in strict adherence to those contracts. This should be restricted to user-facing behaviors such as the UI, as these tests are costly in terms of resources.

- **Behavioral Testing**: Tests that determine whether the system's output acts in accordance with a behavioral contract. These tests are often specified in a syntax that is more friendly to non-engineers, like Cucumber, as part of Behavior-Driven Development. Here, these are restricted to behaviors as we would experience them with a browser.

- **Boundary Testing**: (not to be confused with Boundary Value Testing) Similar to Learning Testing, tests that cover the specific surface of a third-party module's API actually in use. Very useful for testing module updates and as sanity checks, sources of minimally reproducible examples, etc.

- **Boundary Value Analysis** or **Boundary Value Testing**: Ensuring that values that form "boundaries" of different behaviors are included in test data, to guard against off-by-one errors, margin issues, and other defects that can occur when execution paths branch.

- **End-to-End Testing**: Tests that cover the system as a whole, ensuring that it and its third-party code and services and all other dependencies function correctly.

- **Integration Testing**: Tests that cover the operation of multiple units. Here, an integration test should not involve third-party code or services; these should be mocked, stubbed, or monkey-patched out. These won't make sense in all cases, but are valuable for building confidence in a system of units.

- **Learning Testing**: Tests that might be written while learning a third-party module's API. Quickstarts, demos, etc. Valuable and worth keeping around, especially for testing updates to upstream modules, and should be encouraged!

- **Linting**: A form of **Static Analysis** focusing on the syntactic validity, stylistic consistency, and idiomaticity of the source code.

- **Load Testing**: Tests measuring how the entire system behaves under substantial load.

- **Performance Testing**: Tests measuring the raw performance of a specific piece of code, with a focus on identifying bottlenecks or performance regressions.

- **Regression Testing**: Tests that guard against the recurrence of a previously encountered defect or performance issue.

- **Static Analysis**: Automated inspection of the codebase that does not involve execution of code. For instance, analyzing the cyclomatic complexity of a function, ensuring that a variable will be defined before it is accessed along all possible code paths, linting, and so forth.

- **Static Testing**: Tests using Static Analysis to assess the quality of the codebase and identify issues.

- **Test Coverage**: A metric indicating what percentage of lines, statements, expressions, logical branches, etc are exercised by a test suite.

- **Traceability Matrix**: A table that helps determine the completeness of a contractual relationship by correlating the requirements and the components that address them. Here, we're focused on testing; how concerns are addressed by tests.

- **Unit Testing**: Tests that cover our smallest relevant units of logic, generally functions. Unit tests should not involve third-party code or services; these should be mocked, stubbed, or monkey-patched out.

- **Visual Difference Testing**: Tests that use actual images to compare the result of an operation to previous results. This can be used in a variety of situations, but can be rather tiresome to implement and maintain. This is probably best used to valide the output of very specific operations, e.g. cropping and scaling an imagine in a web UI. We don't envision many scenarios involving this sort of operation, but we should be prepared to incorporate it if it becomes advisable.

## Approach

The **Next-Build** project is a fully-modern Javascript project (read: complex, with transpilation, numerous modules, React components, CSS-in-JS, etc). This and the breadth and importance of its mission lead to a substantial QA challenge.

Our testing strategy will address this challenge with the following high-level approach:

- **Codebase Quality**: Assist developers and reviewers by maintaining a consistent level of quality.

- **Product Integrity**: Protect downstream consumers and users by affirming consistent and reliable output.

- **Documentation and Transparency**: Document our assumptions about third-party modules, report our metrics, and stay transparent.

### Codebase Quality

Controlling codebase quality and confirming functional correctness is the most immediate concern. Ideally, these tests will be written as part of the development process and integrate tightly with the tested code.

- **Static Testing**: Use type checking, linting, and other forms of static analysis to reduce the prevalence of common programming bugs, enforce stylistic consistency to guard against developer confusion, and prevent the accumulation of cruft.

- **Unit Testing**: Make writing unit tests easy, clean, and intuitive. Reducing the burden of writing unit tests should have dramatic positive effects on confidence in the codebase.

- **Integration Testing**: Support and encourage writing integration tests for improving confidence in internal systems.

- **Test Coverage**: Aim for 100% test coverage for unit and integration tests. Accept no less than the current coverage, minus a percentage point or two for the sake of flexibility.

- **Regression Testing**: Require that bugfixes include regression tests to prevent the bug from emerging again.

#### Static Testing

The project has adopted **TypeScript**, which tremendously increases the information that developers and their tools are able to glean from a piece of code. Type checking, type inference, etc, enable efficient validation of code as the developer writes it. We have also adopted **ESLint** for linting and general static analysis. ESLint is tremendously flexible, powerful, and configurable, and we expect that the details of its use will evolve over time. Similarly, we've adopted **Prettier** for formatting code, docs, etc.

These tools have already been integrated via Husky, `lint-staged`, etc into the project, but we should consider expanding on this by listing additional tools, e.g. VSCode extensions, that we find to be useful in our daily work.

Static testing generally poses little risk or frustration, provided that the team is agreed upon e.g. code style guidelines. Some developers will be frustrated by analysis techniques like cyclomatic complexity, but this tends to be a problem only when static analysis is implemented later in a project's development and large, complicated functions have formed organically.

#### Unit Testing

The team has landed on **Jest** as the primary tool for unit testing. Jest is easier to install, configure, and use than its primary competitor in the space, Mocha. Generally speaking, the burden of writing unit tests in Jest is very, very low. We should expect near-100% coverage of any code added or revised within the codebase. Over time, as well-covered code is added to the codebase, we should expect to be able to raise our coverage thresholds.

In my experience, mocking tends to be the most labor-intensive and irritating part of writing unit tests, but JavaScript's natural strengths and ease of techniques like monkey-patching can make this a lot more pleasant.  Jest's spying and mocking systems are well-developed and should be easy to integrate.

Jest can also incorporate **Axe** for simple accessibility tests.  If we regularly check accessibility in our unit tests for components, we can largely eliminate that from behavioral tests.

#### Integration Testing

Integration Testing, as used in this document, is really "unit testing beyond the unit," expanding the focus to collections of units that work together. Some developers historically refered to this as a system test. As the boundary between this and unit testing is fairly blurry, we can expect to use the same tools for this purpose as we use in Unit Testing, and the same general patterns and ideas should apply.

#### Test Coverage

Coverage metrics give us an objective figure we can use to describe the breadth of our automated test coverage, identify areas where we're lacking tests, and can inform how we allocate our QA resources.

More coverage is generally better, although there may be diminishing returns to testing certain pieces of code due to factors like lack of complexity, the contexts in which that code is executed, etc.

Coverage measurement and reporting is included in Jest via Istanbul. Istanbul measures code coverage for statements, branches, functions, and lines, and reports uncovered lines. Coverage can be configured via Jest's [`collectCoverageFrom`](https://jestjs.io/docs/configuration#collectcoveragefrom-array) and [`coverageThreshold`](https://jestjs.io/docs/configuration#coveragethreshold-object) options. The coverage thresholds should generally be set to about 2-4% under the current values, with the idea that these numbers will increase over time but may dip very slightly in the course of work on a given PR.

We should consider carefully before lowering code coverage thresholds. If we have a large section of code where coverage is substantially less or substantially more important, we should add a new path and thresholds to `collectCoverageFrom`, like so:

```json
    "coverageThreshold": {
      "global": {
        "branches": 85,
        "functions": 80,
        "lines": 90,
        "statements": 80
      },
      "./src/components/": {
        "branches": 40,
        "statements": 40
      }
    }
```

This should allow us some flexibility in dealing with more and less critical sections of code. Note that this will affect `global` coverage metrics, throwing off recorded values and probably necessitating adjustment to the thresholds, so this should be used thoughtfully.

#### Regression Testing

Regression testing is not a separate class or suite of tests, but rather a general guideline; when we fix a bug, we should not only fix the causes of the bug but also add or extend tests to guard against their reappearance. Bugs can be embarrassing, and a recurring bug is very embarrassing. We can't really automate a check for adding regression tests for bug fixes, but we can agree to expect them as a matter of policy.

The general pattern for this is to add a new test which fails due to the defect, then fix the defect, thereby allowing the test to pass.

### Product Integrity

- **End-to-End Testing**: Make writing end-to-end tests straightforward, efficient, and effective. We should never fear that merging a PR will have an adverse effect on our users.

- **Behavioral Testing**: Insist on tests covering adherence to behavioral contracts. We must be able to confirm consistency of the end user experience without manual testing.

- **Accessibility Testing**: We have a responsibility to adhere to guidelines and best practices.

- **Load Testing**: Guard against performance regressions and identify bottlenecks before they cause issues.

#### End-to-End Testing

This strategy uses **End-to-End** tests to cover complete code paths through the project whose output and side effects can be best processed programmatically.

For instance, imagine we have a code path that 1) makes a request to the CMS for all navigational menus, 2) filters that data structure according to a supplied context, 3) processes that data structure to make it easier and more consistent for consumers to use, and 4) serializes that data structure in a new form. The output is probably quite easy to test programmatically. Does it adhere to a specified schema? Does it contain things we know it should not contain, or not contain things we know it should contain? Does it have a non-zero length? Do all items' paths match a specific regex?

This sort of test is best performed using a system like **Jest**, and will benefit from the other tests and tooling already constructed to handle subsets of the code path in the form of unit tests, integration tests, etc. It will presumably be slower, because of the involvement of upstream servers. It is also likely to be less reliable. One way of handling this is to parameterize end-to-end tests so that they may use fixtures/snapshots or a raw response from the upstream server. This can make tests faster to perform locally, but runs the risk of permitting discrepancies between the expected and actual test dependencies.

One approach would be to use fixtures for PR tests, but use raw responses in tests prior to packaging a release. This should improve speed and reliability of the automated tests while ensuring that only fully-compatible builds are packaged and released. (This concerns incompatibilities introduced unexpectedly from upstream; at any time, a developer can update these snapshots simply by running `jest -u`)

#### Behavioral Testing

This strategy uses **Behavioral** tests to cover code paths through the project whose output is best processed via a web browser. The best tool for this at this time seems to be **Cypress**.

A useful addition to Cypress is `cypress-cucumber-preprocessor`. This uses the Cucumber DSL to transform behavioral scenarios, written very much like user stories, into meaningful test instructions. This can involve a non-trivial investment of time because of the time involved in creating these step definitions.

There is also some risk involved in the step definitions themselves, e.g. what it means for an element to be "visible," and flakiness introduced by variations in the time that different DOM modifications may take to be reflected in the document.

Also, as these tests are designed to replicate the experience of a human being, there is some manual review necessary to verify that the test yields a reasonable facsimile of human interaction.

Finally, as these tests involve an actual web browser loading actual pages, each test is comparatively resource-intensive.

For these reasons, we should work to minimize the amount of behavioral tests, restricting them to testing specific critical contracts. Where possible, functionality should be tested in another way.

#### Accessibility Testing

React components should generally be tested using `jest-axe`; this is fairly lightweight and should integrate well with our unit and integration tests.

Accessibility testing can be trivially added to any Cypress behavioral test by using `cypress-axe`; when a test step is executed that visually affects the DOM, we should make a point of checking the affected area of the DOM. This should probably be used with any substantial component we generate, and any non-trivial step definition we create. This further impacts resource use, but the importance of accessibility to our mission necessitates it.

#### Load Testing

Load testing can be very resource-intensive, so it should be performed sparingly. Based on the current objectives of the project, load testing can probably be performed best simply by performing large numbers of end-to-end tests with fixtures/snapshots. If this involved, the primary role of these tests would likely be to accumulate data in order to assist in debugging issues with scalability, so these might be performed solely during the release/packaging process and reported upstream for posterity.

### Documentation and Transparency

- **Learning Testing**: When a new module or API is added to the codebase, learn it by writing tests rather than in throwaway scripts or playgrounds, and keep them in the codebase!

- **Boundary Testing**: Identify critical functionality, API schemas, and so forth, and write tests to confirm their content and behavior.

- **Reporting and Logging**: Metrics should be reported upstream and stored so that we can directly perceive and compare performance of the tests and the application itself over time.

#### Learning Testing

A common part of investigating and learning about a new module, service, upstream dependency, etc is to read something like a "Quickstart" or "Getting Started" guide and follow along with some trivial examples of how to use it.

Frequently, what then follows is a substantial amount of experimentation as the developer works to learn the API and how to use it to accomplish what they're setting out to do. This might involve a substantial amount of trial and error, possibly benchmarking a few different approaches or comparing how the data is structured differently when retrieved in different ways. This work should be captured! It will help other developers on the project in dealing with that system.

We should normalize and encourage adding tests that don't serve any immediate purpose within the codebase but serve to document how we learn and come to use these resources.

#### Boundary Testing

Boundary tests aren't always practical, but might be in this case; we're retrieving content from a very specific CMS with a constantly evolving content and structure. It would be nice to be able to validate the CMS' response to various API queries against stored responses. Fortunately, Jest's [snapshots](https://jestjs.io/docs/snapshot-testing) make this straightforward. We can perform an API call, replace a few variable values (e.g. date of request), and have a reasonable expectation that we will not be caught unawares by these changes.

Learning Tests, mentioned above, can also serve as Boundary Tests by sketching out what we expect from the portions of third-party code and services that we use.

#### Reporting and Logging

The duration of test runs, both severally and singly, should be recorded and reported. This gives transparency to the developer (who might be waiting for tests to pass on their PR) and also allows tracking the length of test runs over time. This can help us correlate sudden increases in test duration with code changes so that we can inspect or reverse them. It also helps us to set realistic expectations for the review and deployment processes.

On the CMS side, we're using Datadog fairly heavily; we should ensure that any GitHub action that runs a test suite reports relevant metrics to Datadog.

## Roles and Responsibilities

These roles should not be expected to map directly to job titles; rather, they are assumed by a person as they work in a specific capacity. Any developer might act as a test engineer if they make a non-trivial change to a GitHub workflow, and correspondingly they assume the responsibility for that change and its effects (within reason).

### Test Engineers

A **Test Engineer** MUST:

- ensure that the testing environment is correctly configured to run, via Yarn commands, when the project is freshly checked out.
- ensure that pre-commit and other Git hooks are configured to run accurately and appropriately.
- ensure that any GitHub actions fire as expected and function correctly, without inappropriately modifying the codebase, leaking secrets, or otherwise misbehaving.

A **Test Engineer** SHOULD:

- regularly review tests, regardless of type or area of concern, and refactor them to improve their design.
- regularly check for and perform updates on dependencies, and update tests as necessary to conform to changes.
- regularly review coverage, identify problem areas of the codebase, and raise awareness of those areas.
- regularly increase the coverage thresholds to maintain continual improvement.
- monitor developer sentiment and improve it by addressing concerns, barriers, and other issues.

### Developers

Developers bear the primary responsibility for maintaining and expanding test coverage within the project.

A **Developer** MUST:

- write tests at an appropriate level to automate correctness-checking for the code they create:
  - unit tests to verify correctness of functions and objects, incorporating accessibility tests where appropriate
  - integration tests to verify correctness of non-trivial systems of functions and objects, incorporating accessibility tests where appropriate
  - end-to-end tests to verify correctness of systems that have downstream consumers
  - behavioral tests to verify correctness of user interfaces in browser environments, if not sufficiently testable through another method
- write a regression test, if warranted, to guard against the recurrence of a defect.
- take into account testing when estimating tickets.

A **Developer** MUST NOT:

- interfere in the normal execution of a test or check, e.g. bypassing Git hooks with `--no-verify`.
- alter, remove, or disable any test or threshold without first discussing it with the team and determining whether a followup action is necessary.

A **Developer** SHOULD:

- voice any frustrations or obstacles they face in writing or executing tests.
- contribute "learning tests" that document their experiments with an upstream dependency or module, within reason.
- contribute "boundary tests" that represent and document the project's understanding of upstream APIs, within reason.

### Reviewers

A **Reviewer** MUST:

- verify that tests are meaningful, are well-written and maintainable, accomplish the intended objectives, and function as expected.
- verify that the developer has not in any way bypassed the existing tests and thresholds.
- verify that behavioral tests and their step definitions do and will continue to suffice as replacements for manual reviews.
- verify that the developer is adding sufficient new tests to thoroughly cover their modifications.
- verify that regression tests are added when appropriate.

A **Reviewer** MUST NOT:

- approve changes prior to passing all tests, except in the case of emergency.

## Risks and Mitigation

The success of a testing strategy is wholly dependent upon buy-in from the team, individually and severally, in all roles.

Buy-in is contingent upon a number of factors: acceptance of the role of testing in quality assurance, understanding how the tools and strategies will improve developer experience, the coherence of the strategy, and the removal or minimization of practical impediments in day-to-day work.

Consequently, I'll list some risk factors to this test strategy and discuss how each might be mitigated.

- **Developer Resistance**: A testing strategy is hard to get right. Issues with the strategy will manifest in increased developer resistance. The strategy must be treated as a first-class software product in its own right; bugs must be quickly addressed, communication must be open and honest, and overall quality has to be high. There's no real shortcut here. Indeed, most of the following risks impact the project at least partially through increasing developer resistance.

- **High Barrier to Entry**: Learning _how_ to create tests is non-trivial and poses a significant additional frustration on top of that presented by development in general. It can't be eliminated, but we can reduce the burden by ensuring there's a simple test case covering each of the myriad patterns that the project will contain. For instance, tests for simple and complex algorithms, tests for React components demonstrating how rendering can be validated and checked against accessibility guidelines, tests snapshotting requests and responses to external services, etc.

- **Additional Cost**: Testing incurs additional costs in time and energy from developers and reviewers. This can be unwelcome, especially in the early phases of a project. As above, this can be remediated to some degree by providing examples, but it is also important to allocate sprint capacity for testing at both the level of the individual tasks and at the level of the team as a whole.

- **Differences Across Test Environments**: Sometimes, differences in test environments can impact testing; for instance, GitHub tests can take place on a self-hosted runner, which introduces points of departure that might be difficult to anticipate, resulting in frustrating bugs and long feedback cycles during development. It is probably best to avoid running anything in environments like GitHub Actions that can't be run easily and reliably in a local development environment.

## Concern Traceability Matrix

This traceability matrix correlates the types of concerns we anticipate with the tactics we may use to address them. In most cases, multiple tactics may be used to address a single concern.

| Concern\Tactic         | Static Analysis | Linting | Code Style | Unit | Integration | Test Coverage | End-to-End | Behavioral | Accessibility | Learning | Boundary | Reporting/Logging | Load Testing |
| ---------------------- | --------------- | ------- | ---------- | ---- | ----------- | ------------- | ---------- | ---------- | ------------- | -------- | -------- | ----------------- | ------------ |
| Developer Confidence   | ✓               | ✓       |            | ✓    | ✓           | ✓             | ✓          | ✓          |               | ✓        | ✓        |                   |              |
| Reviewer Confidence    |                 |         |            | ✓    | ✓           | ✓             | ✓          | ✓          |               | ✓        | ✓        |                   |              |
| Maintainer Confidence  |                 |         |            | ✓    | ✓           | ✓             | ✓          | ✓          |               | ✓        | ✓        | ✓                 |              |
| Stakeholder Confidence |                 |         |            |      |             | ✓             | ✓          | ✓          | ✓             |          |          | ✓                 |              |
| Developer experience   | ✓               | ✓       | ✓          |      |             |               |            |            |               | ✓        |          |                   |              |
| Accessibility          |                 |         |            |      |             |               |            |            | ✓             |          |          |                   |              |
| Scalability            |                 |         |            |      |             |               |            |            |               |          |          |                   | ✓            |

## Tool Traceability Matrix

The following is a traceability matrix correlating the types of tests we want to perform with the tools we may use to perform them. In some cases, multiple tools will be used to address a single type of test.

| Type\Tool           | TypeScript | ESLint | Prettier | Jest | Cypress | DataDog |
| ------------------- | ---------- | ------ | -------- | ---- | ------- | ------- |
| Static Analysis     | ✓          |        |          |      |         |         |
| Linting             | ✓          | ✓      |          |      |         |         |
| Code Style          |            | ✓      | ✓        |      |         |         |
| Unit Tests          |            |        |          | ✓    |         |         |
| Integration Tests   |            |        |          | ✓    |         |         |
| Test Coverage       |            |        |          | ✓    |         |         |
| End-to-End Tests    |            |        |          | ✓    |         |         |
| Behavioral Tests    |            |        |          |      | ✓       |         |
| Accessibility Tests |            |        |          | ✓    | ✓       |         |
| Load Testing        |            |        |          | ✓    |         |         |
| Reporting / Logging |            |        |          |      |         | ✓       |

## Scheduling & Environment

The following correlates the tests we'll perform with how and when they are executed. In some cases, tests will be performed at multiple stages for auditability or other reasons.

| Type\Environment    | IDE | Interactive | Pre-Commit Hook | GitHub PR | Release |
| ------------------- | --- | ----------- | --------------- | --------- | ------- |
| TypeScript          | ✓   |             | ✓               | ✓         | ✓       |
| ESLint              | ✓   | ✓           | ✓               | ✓         | ✓       |
| Prettier            | ✓   | ✓           | ✓               | ✓         | ✓       |
| Unit Tests          |     | ✓           | ✓\*             | ✓         | ✓       |
| Integration Tests   |     | ✓           |                 | ✓         | ✓       |
| Test Coverage       |     | ✓           |                 | ✓         | ✓       |
| End-to-End Tests    |     | ✓           |                 | ✓†        | ✓‡      |
| Behavioral Tests    |     | ✓           |                 | ✓         | ✓       |
| Accessibility Tests |     | ✓           |                 | ✓         | ✓       |
| Load Testing        |     | ✓           |                 |           | ✓       |
| Reporting / Logging |     |             |                 | ✓         | ✓       |

- \* using `jest --findRelatedTests` to limit tests executed to those actually affected by changes
- † using fixtures in place of actual upstream calls
- ‡ using actual upstream calls and rejecting if the responses do not match fixtures
