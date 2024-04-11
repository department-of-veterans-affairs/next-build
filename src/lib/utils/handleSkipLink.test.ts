import { handleSkipLink } from './handleSkipLink'

describe('handleSkipLink', () => {
  let mockEvent
  let contentDiv
  let firstH1

  beforeEach(() => {
    mockEvent = { preventDefault: jest.fn() }

    document.body.innerHTML = `
      <div>
        <a href="#content" id="skip">Skip to content</a>
        <div id="content">
          <h1>Page Title</h1>
          <p>Content goes here</p>
        </div>
      </div>
    `

    contentDiv = document.getElementById('content')
    firstH1 = contentDiv.querySelector('h1')

    window.scrollTo = jest.fn()
  })

  it('prevents the default event action', () => {
    handleSkipLink(mockEvent)
    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  it('focuses the first h1 element', () => {
    const spy = jest.spyOn(HTMLElement.prototype, 'focus')
    handleSkipLink(mockEvent)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('scrolls into the first h1 element position', () => {
    handleSkipLink(mockEvent)
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: expect.any(Number) })
    )
  })

  it('adds and then removes the tabindex attribute to the first h1 element', () => {
    handleSkipLink(mockEvent)
    expect(firstH1.getAttribute('tabindex')).toBe('-1')

    firstH1.dispatchEvent(new Event('blur'))
    expect(firstH1.getAttribute('tabindex')).toBeNull()
  })

  it('does nothing if content div is missing', () => {
    document.body.innerHTML = `<div><a href="#content" id="skip">Skip to content</a></div>`
    handleSkipLink(mockEvent)
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})
