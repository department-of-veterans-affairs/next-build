import { drupalClient } from '@/utils/drupalClient'
import nock from 'nock'

const getData = async () => {
  const res = await drupalClient.fetch('http://localhost:3000/api/')
  const data = res.json()
  return data
}

const slugRoute = async () => {
  nock('http://localhost:3000/api/')
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
  nock('http://localhost:3000/api/')
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
  it('if path alias matches home', async () => {
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
