/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import Debug from 'debug'
import fetch from 'cross-fetch'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const debug = Debug('vets-website-assets')

/**
 * This script gathers additional assets for building the front-end of VA.gov.
 *
 * Most of the assets are in the form of compiled javascript or css files.
 * Additional assets are sourced directly from the vets-website repo.
 *
 * In the case of BUILD_TYPE=localhost, all assets are symlinked directly from a local vets-website repo
 * instead of requesting anything from a bucket.
 */

const prodBucket = 'http://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com'
const stagingBucket =
  'http://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com'
const devBucket = 'http://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com'

// __dirname is not defined in ES module scope, need to do this to get localbucket path
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory
const localBucket = path.resolve(
  __dirname,
  '../../../vets-website/build/localhost/generated'
)

// Available bucket options, default is the vagovprod bucket.
const BUILD_TYPE_BUCKET = {
  localhost: localBucket,
  tugboat: devBucket,
  vagovdev: devBucket,
  vagovstaging: stagingBucket,
  vagovprod: prodBucket,
}

// This file exists in the above buckets and contains a list to all compiled assets that should be included.
const fileManifestPath = 'generated/file-manifest.json'

// Path to assets in a vets-website repo cloned adjacent to next-build.
const vetsWebsiteAssetPath = '../vets-website/src/site/assets'

const destinationPath = path.resolve(__dirname, '../../public/generated/')

// Function that loops through to download all compiled js assets listed in a bucket's manifest.
async function downloadFromLiveBucket(buildtype) {
  debug('Downloading assets from live bucket...')
  const bucket = BUILD_TYPE_BUCKET[buildtype]

  const fileManifestRequest = await fetch(`${bucket}/${fileManifestPath}`)
  const fileManifest = await fileManifestRequest.json()

  const entryNames = Object.keys(fileManifest)

  const downloads = entryNames.map(async (entryName) => {
    let bundleFileName = fileManifest[entryName]
    const bundleUrl = bundleFileName.includes(bucket)
      ? `${bundleFileName}`
      : `${bucket}${bundleFileName}`
    const bundleResponse = await fetch(bundleUrl)

    if (bundleFileName.includes('generated/../')) {
      debug(`Excluding: ${bundleFileName} from download`)
    } else {
      if (!bundleResponse.ok) {
        debug(`Failed to download asset: ${bundleUrl} %O`, bundleResponse)
        throw new Error(`Failed to download asset: ${bundleUrl}`)
      }

      if (bundleFileName.startsWith('/')) {
        bundleFileName = bundleFileName.slice(1)
      }

      // Store file contents directly on disk
      fs.outputFileSync(
        path.join('./public/', bundleFileName),
        await bundleResponse.buffer()
      )
    }
  })
  return Promise.all(downloads)
}

// Gather assets that are expected by the compiled files but not included in the bucket (because content-build would source them).
// These are primarily images.
async function moveAssetsFromVetsWebsite() {
  debug('Moving additional assets from adjacent vets-website repo...')

  try {
    fs.copySync(`${vetsWebsiteAssetPath}/img`, './public/img/')
    debug('Copied image assets from vets-website.')

    const fontsDir = fs.readdirSync(`${vetsWebsiteAssetPath}/fonts`)
    for (let i = 0; i < fontsDir.length; i += 1) {
      const font = fontsDir[i]
      fs.copySync(
        `${vetsWebsiteAssetPath}/fonts/${font}`,
        `${destinationPath}/${font}`
      )
    }
    debug('Copied font files from vets-website.')
  } catch (err) {
    debug('%O', err)
  }
}

// Determine build type and request all assets accordingly.
async function gatherAssets() {
  debug('Gathering vets-website assets...')
  const buildtype = process.env.BUILD_TYPE || 'vagovprod'

  // Clean any existing assets or symlinks
  if (fs.pathExistsSync(destinationPath)) {
    try {
      fs.rmSync(destinationPath, { recursive: true, force: true })
      debug(
        `Removed existing vets-website assets. Preparing to gather fresh from ${BUILD_TYPE_BUCKET[buildtype]}`
      )
    } catch (err) {
      debug('%O', err)
    }
  }
  // Download compiled js assets from the appropriate bucket.
  if (buildtype !== 'localhost') {
    await downloadFromLiveBucket(buildtype)
    debug(
      `Successfully downloaded all assets listed in ${BUILD_TYPE_BUCKET[buildtype]}/${fileManifestPath}`
    )
  }
  // Localhost, use symlink from adjacent cloned repo for all assets
  else {
    debug('Attempting to symlink assets from your local vets-website repo...')

    try {
      // Checks if symlink already exists
      const exists = fs.pathExistsSync(destinationPath)

      if (!exists) {
        fs.ensureSymlinkSync(localBucket, destinationPath, 'dir') // 'dir' is windows only, ignored elsewhere
        debug('Symlink created successfully!')
      } else {
        debug('Symlink already exists.')
      }
    } catch (error) {
      debug('\nError creating symlink: %O', error)
      debug('\nRe-build your local vets-website assets and try again. \n')
    }
  }

  await moveAssetsFromVetsWebsite()

  debug('\nAll vets-website assets gathered.')
}

gatherAssets()
