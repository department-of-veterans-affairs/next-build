/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import fetch from 'cross-fetch'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * This script gathers additional assets for building the front-end of VA.gov.
 *
 * Most of the assets are in the form of compiled javascript or css files.
 * Additional assets are sourced directly from the vets-website repo.
 *
 * In the case of BUILD_TYPE=localhost, all assets are symlinked directly from a local vets-website repo
 * instead of requesting anything from a bucket.
 */

const prodBucket = 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com'
const stagingBucket =
  'https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com'
const devBucket = 'https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com'

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
  vagovdev: devBucket,
  vagovstaging: stagingBucket,
  vagovprod: prodBucket,
}

// This file exists in the above buckets and contains a list to all compiled assets that should be included.
const fileManifestPath = 'generated/file-manifest.json'

// Path to assets in a vets-website repo cloned adjacent to next-build.
const vetsWebsiteAssetPath = '../vets-website/src/site/assets'

const destinationPath = './public/generated/'

// Function that loops through to download all compiled js assets listed in a bucket's manifest.
async function downloadFromLiveBucket(buildtype) {
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
      console.log(`Excluding: ${bundleFileName} from download`)
    } else {
      if (!bundleResponse.ok) {
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
// These are font files, icons, and other assorted images.
async function moveAssetsFromVetsWebsite() {
  console.log('Moving additional assets from adjacent vets-website repo...')

  try {
    fs.copySync(`${vetsWebsiteAssetPath}/fonts`, destinationPath)
    console.log('Copied font files from vets-website.')

    fs.copySync(`${vetsWebsiteAssetPath}/img`, './public/img/')
    console.log('Copied image assets from vets-website.')

    // Some stylesheets from vets-website expect these additional font files, but they are not included
    // in the bucket files or in that repo's font folder. We source them directly from the node module.
    fs.copySync(
      './node_modules/@fortawesome/fontawesome-free/webfonts',
      destinationPath,
      { errorOnExist: false, force: true, dereference: true }
    )
    console.log('Copied fontawesome font files from node_modules package.')
  } catch (err) {
    console.error(err)
  }
}

// Determine build type and request all assets accordingly.
async function gatherAssets() {
  const buildtype = process.env.BUILD_TYPE || 'vagovprod'

  // Clean any existing assets or symlinks
  if (fs.pathExistsSync(destinationPath)) {
    try {
      fs.rmSync(destinationPath, { recursive: true, force: true })
      console.log(
        `Removed existing vets-website assets. Preparing to gather fresh from ${BUILD_TYPE_BUCKET[buildtype]}`
      )
    } catch (err) {
      console.error(err)
    }
  }
  // Download compiled js assets from the appropriate bucket.
  if (buildtype !== 'localhost') {
    await downloadFromLiveBucket(buildtype)
    console.log(
      `Successfully downloaded all assets listed in ${BUILD_TYPE_BUCKET[buildtype]}/${fileManifestPath}`
    )
  }
  // Localhost, use symlink from adjacent cloned repo for all assets
  else {
    console.log(
      'Attempting to symlink assets from your local vets-website repo...'
    )

    try {
      // Checks if symlink already exists
      const exists = fs.pathExistsSync(destinationPath)

      if (!exists) {
        fs.ensureSymlinkSync(
          localBucket,
          path.resolve(__dirname, `../..${destinationPath}`),
          'dir'
        ) // 'dir' is windows only, ignored elsewhere
        console.log('Symlink created successfully!')
      } else {
        console.log('Symlink already exists.')
      }
    } catch (error) {
      console.error('\nError creating symlink:', error)
      console.log('\nRe-build your local vets-website assets and try again. \n')
    }
  }

  await moveAssetsFromVetsWebsite()

  console.log('\nAll vets-website assets gathered.')
}

gatherAssets()
