# Example Tests

This directory contains example tests. Their purpose is to give a gentle introduction to the test tools used in this project.

To run _all_ of the tests on _all_ of the examples, run `yarn test:examples` from the root directory.

These tests are intended to run on CI, as it keeps them working in the context of changes to the surrounding project. If any of these tests start to fail, please correct the underlying issue rather than disabling the test or example_tests entirely. 

## 01. [Hello, world!](./01_hello_world/)

This is an extremely basic "Hello, world!" sort of application, and has a correspondingly simple test.

## 02. [Hello, world! (but asynchronously)](./02_hello_world_async/)

Promises can complicate testing. This shows two simple ways of dealing with that.

## 03. [More Matchers](./03_more_matchers/)

Matchers are functions that verify that some value (`received`) matches some condition exists in some relationship with a comparison value (`expected`). This set of tests demonstrates a variety of matchers, how they are used, and some possible surprises in using them.

## 04. [Hello, world! (but as a React Component)](./04_hello_world_react/)

This covers simple tests for a simple component, for developers new to React or Jest.

## 05. [An Interactive React Component](./05_interactive_components/)

This component is more complex; it renders a header, `<select>` element, and a conditional `<div>` displaying an alert. It maintains internal state and reacts to user events.

## 06. [Accessibility Tests](./06_accessibility_tests/)

This shows how to perform accessibility tests within unit tests.

## 07. [Tests With Mock Data](./07_tests_with_mock_data/)

Mocks are only useful if they accurately mirror production responses; this example shows how to use `nock`, which is used to record and play back network requests and responses for use as mock fixtures.
