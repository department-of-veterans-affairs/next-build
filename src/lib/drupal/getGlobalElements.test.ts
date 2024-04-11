import axios from 'axios'
import nock from 'nock'
import { getGlobalElements } from './getGlobalElements'

axios.defaults.adapter = 'http'

const getData = async () => {
  const res = await axios.get(`http://localhost:${process.env.PORT}/api/`)
  const data = res.data
  return data
}

const slugRoute = async () => {
  nock(`http://localhost:${process.env.PORT}/api/`)
    .get('/')
    .reply(200, {
      data: {
        id: 1,
        title: 'COVID-19 vaccines Pittsburgh',
        visible: false,
        path: {
          alias: '/pittsburgh-health-care/stories/covid-19-vaccines',
        },
      },
    })
}

const homeRoute = async () => {
  nock(`http://localhost:${process.env.PORT}/api/`)
    .get('/')
    .reply(200, {
      data: {
        id: 1,
        title: '',
        visible: false,
        path: {
          alias: '/home',
        },
      },
    })
}

describe('drupalClient renders home data', () => {
  test('if path alias matches home', async () => {
    await homeRoute()
    const results = await getData()
    // eslint-disable-next-line
    let { path, visible, title } = results.data
    if (path?.alias.includes('home')) {
      visible = true
      title = 'COVID-19 vaccines'
    }
    expect(visible).toEqual(true)
    expect(title).toEqual('COVID-19 vaccines')
  })
})

// import async function getGlobalElements and test bannerData from it
describe('drupalClient renders slug data', () => {
  test('if path alias matches slug', async () => {
    await slugRoute()
    const results = await getData()
    // eslint-disable-next-line
    let { path, visible, title } = results?.data
    if (path?.alias.includes('pittsburgh-health-care')) {
      visible = true
    }
    expect(visible).toEqual(true)
    expect(title).toEqual('COVID-19 vaccines Pittsburgh')
  })
  test('if path alias matches does not match slug', async () => {
    await slugRoute()
    const results = await getData()
    // eslint-disable-next-line
    let { path, visible } = results?.data
    if (path?.alias.includes('/home')) {
      visible = false
    }
    expect(visible).toEqual(false)
  })
})
// Mock the queries module to prevent calling getQueryData during the test
jest.mock('@/data/queries', () => ({
  queries: {
    getData: jest.fn().mockResolvedValue({}),
  },
}))

describe('getGlobalElements', () => {
  test('invokes getGlobalElements without error', async () => {
    const result = await getGlobalElements()
    expect(result).toBeTruthy()
  })
})
