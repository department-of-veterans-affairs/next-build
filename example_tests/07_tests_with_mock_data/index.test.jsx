import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MyResource } from './'
import { nockBack } from 'test-utils'
import nock from 'nock'
import http from 'http'

// The following line tells Nock to store the fixtures in this directory.
nockBack.fixtures = __dirname

/**
 * A function that contacts a server and returns a JSON-formatted string.
 *
 * Having this sort of function in a test can be problematic; for instance,
 * we don't want tests to fail, preventing a production deployment, if prod
 * is already in a broken state!  Also, even the most stable network is prone
 * to seemingly random burps and hiccups.
 *
 * TL;DR: We want to mock the innards of this function for better reliability.
 *
 * For this example, we'll actually spin up a server that responds with a
 * constant, well-formed JSON response.
 *
 * @returns {string} A raw JSON response.
 */
const getResource = async () => {
  // Something unlikely to cause conflicts.
  const port = 54447
  /*
   * Most of the following details aren't terribly relevant.
   *
   * The only important idea is that we have some outgoing network request that
   * we want to mock.
   */
  const result = await new Promise((resolve) => {
    // Create a server...
    let server = http
      .createServer((req, res) => {
        // I've been really into Roxy Music lately, IDK.
        const body =
          'If there is something that I might find / Look around corners / Try to find peace of mind I say / Where would you go if you were me / Try to keep a straight course not easy / Somebody special looking at me / A certain reaction we find / What should it try to be I mean / If there are many / Meaning the same / Be specific just a game'
        // Write out a very simple JSON document.
        res.write(
          JSON.stringify({
            title: 'If There Is Something',
            author: 'Roxy Music',
            body,
          })
        )
        res.end()
      })
      .listen(port, () => {
        /*
         * Once the server is running, connect to it.
         *
         * This is where the interesting stuff with Nock happens.
         *
         * The server is running, the request is made, but if the fixture
         * exists in the filesystem, Nock will return that response
         * instead of actually contacting the server.
         *
         * But as far as the code below is concerned, there's no difference.
         * The data will be processed the same and the server will be stopped
         * either way.
         */
        http.get(`http://localhost:${port}`, (res) => {
          let rawData = ''
          res.on('data', (chunk) => {
            rawData += chunk
          })
          res.on('end', () => {
            resolve(JSON.parse(rawData))
            // Stop the server from accepting new connections.
            server.close()
          })
        })
      })
  })
  return result
}

afterAll(async () => {
  // Nock and Jest don't play perfectly well together, which can apparently lead to memory leaks.
  // To guard against this, call nock.restore() after each or all tests.
  nock.restore()
})

describe('<MyResource> component', () => {
  test('renders with minimal data', async () => {
    /*
     * The fixture will be created in the specified file.
     *
     * Nock assumes that the file is valid if it exists.
     *
     * If it is deleted, Nock will seamlessly recreate it with the actual
     * response received from the server above.
     *
     * nockDone() needs to be called when this test is done with the mock.
     */
    const { nockDone } = await nockBack('index_mock.json')
    const data = await getResource()
    render(<MyResource data={data} />)
    expect(screen.queryByText(/roxy music/i)).toBeInTheDocument()
    nockDone()
  })
})
