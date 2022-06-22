const actualGetSelection = window.getSelection

Object.defineProperty(window, 'getSelection', {
  ...actualGetSelection,
  getRangeAt: () => ({
    ...actualGetSelection.getRangeAt,
    cloneRange: () => ({
      ...actualGetSelection.getRangeAt.cloneRange,
      getClientRects: () => jest.fn(),
    }),
  }),

  writable: true,
})

Range.prototype.getBoundingClientRect = () => ({
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
})
Range.prototype.getClientRects = () => ({
  item: () => null,
  length: 0,
  [Symbol.iterator]: jest.fn(),
})
