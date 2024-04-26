import { render, screen } from '@testing-library/react'
import { PressRelease } from './index'

const data = {
  id: '6153ed5b-85c2-4ead-9893-3d656ad5d758',
  entityId: 18141,
  entityPath: '/wilmington-health-care/news-releases/wilmington-vamc-2019-annual-report',
  type: 'node--press_release',
  published: false,
  moderationState: 'draft',
  title: 'Wilmington VAMC 2019 Annual Report',
  metatags: [
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'link', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] },
    { tag: 'meta', attributes: [Object] }
  ],
  breadcrumbs: [
    {
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/',
      title: 'Home',
      options: []
    },
    {
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/wilmington-health-care',
      title: 'VA Wilmington health care',
      options: []
    },
    {
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/wilmington-health-care/news-releases',
      title: 'News releases',
      options: []
    },
    {
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/wilmington-health-care/news-releases/wilmington-vamc-2019-annual-report',
      title: 'Wilmington VAMC 2019 Annual Report',
      options: []
    }
  ],
  lastUpdated: '2021-04-12T14:25:27+00:00',
  releaseDate: undefined,
  pdfVersion: undefined,
  introText: undefined,
  address: undefined,
  fullText: undefined,
  contacts: undefined,
  downloads: undefined,
  office: undefined,
  listing: undefined
}

describe('PressRelease with valid data', () => {
  test('renders PressRelease component', () => {
    render(
      <PressRelease {...data} />
    )
    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})
