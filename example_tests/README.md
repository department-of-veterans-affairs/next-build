# Example Tests

This directory contains example tests. Their purpose is to give a gentle introduction to the test tools used in this project.

To run _all_ of the tests on _all_ of the examples, run `yarn test:examples` from the root directory.

To run

## 01. [Hello, world!](./01_hello_world/)

This is an extremely basic "Hello, world!" sort of application, and has a correspondingly simple test.

## 02. [Hello, world! (but asynchronously)](./02_hello_world_async/)

Promises can complicate testing. This shows two simple ways of dealing with that.

## 03. [More Matchers](./03_more_matchers/)

Matchers are functions that verify that some value (`received`) matches some condition exists in some relationship with a comparison value (`expected`). This set of tests demonstrates a variety of matchers, how they are used, and some possible surprises in using them.

## 04. [Hello, world! (but as a React Component)](./04_hello_world_react/)

This covers simple tests for a simple component, for developers new to React or Jest.

## 05. [An Interactive React Component](./05_interactive_components/)
