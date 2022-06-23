import { axe, faker, render, screen, waitFor } from 'test-utils'
import Image from '.'
import mediaImageIndividual from './mediaImageIndividual.json'

const getUrl = (data) =>
  data.included.filter((obj) => obj.type == 'file--file')[0].attributes.uri.url

const getAltText = (data) => data.data.relationships.image.data.meta.alt
const getWidth = (data) => data.data.relationships.image.data.meta.width
const getHeight = (data) => data.data.relationships.image.data.meta.height

describe('Image Component', () => {
  test('throws an error if no URL is passed in', () => {
    const originalError = console.error
    console.error = jest.fn()
    // eslint-disable-next-line
    expect(() => render(<Image />)).toThrow(
      /image is missing required "src" property/i
    )
    console.error = originalError
  })
  test('throws an error if no height/width properties are passed in', async () => {
    const originalError = console.error
    console.error = jest.fn()
    let url = getUrl(mediaImageIndividual)
    // eslint-disable-next-line
    expect(() => render(<Image src={url} />)).toThrow(
      /image with src "([^"]*)" must use "width" and "height" properties/i
    )
    console.error = originalError
  })
  test('triggers an accessibility error if no alt text is passed in', async () => {
    let url = getUrl(mediaImageIndividual)
    // eslint-disable-next-line
    const { container } = render(<Image src={url} layout={'fill'} />)
    await waitFor(async () =>
      expect(await axe(container)).toEqual(
        expect.objectContaining({
          violations: expect.arrayContaining([
            expect.objectContaining({
              help: expect.stringMatching(/images must have alternate text/i),
              id: 'image-alt',
              impact: 'critical',
            }),
          ]),
        })
      )
    )
  })
  test('renders if sufficient properties are provided', async () => {
    let url = getUrl(mediaImageIndividual)
    let altText = getAltText(mediaImageIndividual)
    let props = {
      alt: altText,
      src: url,
      width: 600,
      height: 400,
    }
    // eslint-disable-next-line
    const { container } = render(<Image {...props} />)
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
    let imgElement

    // Loading element
    imgElement = document.querySelector('img[alt=""]')
    expect(imgElement).toHaveAttribute('alt', '')
    expect(imgElement).toHaveAttribute('aria-hidden', 'true')
    expect(imgElement).toHaveAttribute(
      'src',
      expect.stringContaining('data:image/svg+xml')
    )
    expect(imgElement).toHaveAttribute('style', expect.any(String))

    // Actual element
    imgElement = document.querySelector('img[data-nimg="intrinsic"]')
    expect(imgElement).toHaveAttribute('alt', altText)
    expect(imgElement).toHaveAttribute('data-nimg', 'intrinsic')
    expect(imgElement).toHaveAttribute('src', expect.any(String))
    expect(imgElement).toHaveAttribute('style', expect.any(String))
  })
})
