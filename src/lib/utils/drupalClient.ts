import { DrupalClient } from 'next-drupal'
import crossFetch from 'cross-fetch'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { addCAs } from 'syswide-cas'
import * as fs from 'fs'

const https = require('https')

interface TLSSecretData {
  cert: string
}

export const agent = new SocksProxyAgent('socks://127.0.0.1:2001')
export const CERTS_DIRECTORY = 'certs/'
export const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
export const useProxy = baseUrl.includes('cms.va.gov')

export const loadCertificate = async (): Promise<TLSSecretData> => {
  const certs = await fs.promises.readdir(CERTS_DIRECTORY)
  const certificateAuthority = certs.find((c) => c.includes('.pem'))
  https.globalAgent.options.ca = []

  if (!certificateAuthority) {
    fs.readdir(CERTS_DIRECTORY, (err, files) => {
      if (err) {
        console.log(err)
      } else {
        files.forEach((file) => {
          const cert = fs.readFileSync(CERTS_DIRECTORY + file)
          https.globalAgent.options.ca.push(cert)
        })
      }
    })
  }

  if (fs.existsSync(CERTS_DIRECTORY)) {
    return addCAs(CERTS_DIRECTORY || certificateAuthority)
  }
}

export const fetcher = (input: RequestInfo, init?: RequestInit) => {
  if (useProxy) {
    loadCertificate()
      .then(() => {
        console.log('Loaded certificate')
      })
      .catch((err) => {
        console.log('Error loading certificate', err)
      })
      .finally(() => {
        console.log('Finished loading certificate')
      })
  }
  const options = {
    agent: useProxy ? agent : null,
    ...init,
  }
  return crossFetch(input, {
    ...options,
  })
}

export const drupalClient = new DrupalClient(baseUrl, {
  fetcher,
})
