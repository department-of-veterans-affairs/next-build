import { axe, faker, render, waitFor } from 'test-utils'
import Image from '.'
import mock_media_image from './mediaImageIndividual.json'

const getUrl = (data) =>
  data.included.filter((obj) => obj.type == 'file--file')[0].attributes.uri.url

const getAltText = (data) => data.data.relationships.image.data.meta.alt
const getWidth = (data) => data.data.relationships.image.data.meta.width
const getHeight = (data) => data.data.relationships.image.data.meta.height

describe('Image Component', () => {
  test('throws an error if URL is empty', async () => {
    const originalError = console.error
    console.error = jest.fn()
    // eslint-disable-next-line
    expect(() => render(<Image src={url} />)).toThrowError(
      /url is not defined/i
    )
    console.error = originalError
  })

  test('throws an error if no height/width properties are passed in', async () => {
    const originalError = console.error
    console.error = jest.fn()
    let url = getUrl(mock_media_image)
    // eslint-disable-next-line
    expect(() => render(<Image src={url} />)).toThrow(
      /Image with src "([^"]*)" is missing required "width" property./
    )
    console.error = originalError
  })

  test('triggers an accessibility error if no alt text is passed in', async () => {
    let url = getUrl(mock_media_image)
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
    let url = getUrl(mock_media_image)
    let altText = getAltText(mock_media_image)
    let props = {
      alt: altText,
      src: url,
      width: 600,
      height: 400,
    }
    // eslint-disable-next-line
    const { container } = render(<Image id={'testImage'} {...props} />)
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
    let imgElement


    // Actual element
    imgElement = document.querySelector('#testImage')
    expect(imgElement).toHaveAttribute('alt', altText)
    expect(imgElement).toHaveAttribute('src', expect.any(String))
    expect(imgElement).toHaveAttribute('style', expect.any(String))
  })
})
