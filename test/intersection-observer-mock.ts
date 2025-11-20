// Enhanced IntersectionObserver mock that can trigger callbacks for testing
// See https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
// This file is separate from test-utils.ts to avoid importing polyfills that require window
// to be available, since this is imported in jest.setup.js

export type ObserverInstance = {
  callback: IntersectionObserverCallback
  elements: Element[]
  disconnect: () => void
  unobserve: () => void
}

export const observerInstances: ObserverInstance[] = []

export class MockIntersectionObserver implements IntersectionObserver {
  root = null
  rootMargin = ''
  thresholds: ReadonlyArray<number> = []
  callback: IntersectionObserverCallback
  elements: Element[] = []
  instance: ObserverInstance

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    this.instance = {
      callback,
      elements: this.elements,
      disconnect: this.disconnect.bind(this),
      unobserve: this.unobserve.bind(this),
    }
    observerInstances.push(this.instance)
  }

  observe(element: Element) {
    this.elements.push(element)
    this.instance.elements.push(element)
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    const index = observerInstances.indexOf(this.instance)
    if (index > -1) {
      observerInstances.splice(index, 1)
    }
    this.elements = []
    this.instance.elements = []
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  // Helper method to simulate intersection changes
  simulateIntersection(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this)
  }
}

// Helper function to trigger intersection observer callbacks
// Note: Tests should wrap calls to this function in act() if triggering React state updates
export function triggerIntersection(
  element: Element,
  isIntersecting: boolean
): void {
  const instance = observerInstances.find((inst) =>
    inst.elements.includes(element)
  )
  if (instance) {
    const mockEntry = {
      isIntersecting,
      target: element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null as DOMRectReadOnly | null,
      time: Date.now(),
    } as IntersectionObserverEntry

    instance.callback([mockEntry], instance as unknown as IntersectionObserver)
  }
}
