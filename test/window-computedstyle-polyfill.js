/*
Work around an issue in axe-core, jsdom, jest-axe, or who-knows-where
that nobody wants to debug or accept responsibility for.
- https://github.com/nickcolley/jest-axe/issues/147
- https://github.com/jsdom/jsdom/issues/3025
- https://github.com/testing-library/dom-testing-library/issues/774
- https://github.com/mswjs/examples/pull/46

Hopefully, this can be removed at some point.
*/
const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)
