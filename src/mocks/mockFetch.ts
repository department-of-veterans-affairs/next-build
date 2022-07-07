import { faker } from 'test-utils'

const links = Array(5)
  .fill()
  .map(() => ({
    columns: faker.datatype.number({ min: 1, max: 4 }),
    title: faker.lorem.sentence(3),
    href: faker.internet.url(),
  }))

const footerResponse = links

export default async function mockFetch(url) {
  switch (url) {
    case 'https://www.va.gov/generated/headerFooter.json': {
      return {
        ok: true,
        status: 200,
        json: async () => footerResponse,
      }
    }
    default: {
      throw new Error(`Unhandled request: ${url}`)
    }
  }
}
