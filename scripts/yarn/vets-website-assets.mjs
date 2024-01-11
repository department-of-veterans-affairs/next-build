/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import fetch from 'cross-fetch'
import fs from 'fs-extra'
import path from 'path'

// exits with non-zero if a download failed
process.on('unhandledRejection', (up) => {
  throw up
})

const prodBucket = 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com'
const stagingBucket =
  'https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com'
const devBucket = 'https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com'

const BUILD_TYPE_BUCKET = {
  localhost: devBucket,
  tugboat: devBucket,
  vagovdev: devBucket,
  vagovstaging: stagingBucket,
  vagovprod: prodBucket,
}

const fileManifestPath = 'generated/file-manifest.json'

const vetsWebsiteAssetPath = '../vets-website/src/site/assets'

async function downloadFromLiveBucket(buildtype) {
  const bucket = BUILD_TYPE_BUCKET[buildtype]

  const fileManifestRequest = await fetch(`${bucket}/${fileManifestPath}`)
  const fileManifest = await fileManifestRequest.json()

  const files = []

  files[fileManifestPath] = {
    path: fileManifestPath,
    contents: Buffer.from(JSON.stringify(fileManifest)),
  }

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

      files[bundleFileName] = {
        path: bundleFileName,
        // No need to store file contents here since
        // assets will be stored directly on disk
        contents: '',
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

async function moveAssetsFromVetsWebsite() {
  console.log('Moving additional assets from adjacent vets-website repo...')

  try {
    fs.copySync(`${vetsWebsiteAssetPath}/fonts`, './public/generated/')
    console.log('Copied font files from vets-website')

    fs.copySync(`${vetsWebsiteAssetPath}/img`, './public/img/')
    console.log('Copied image assets from vets-website')
  } catch (err) {
    console.error(err)
  }
}

export async function downloadAssets() {
  const buildtype = process.env.BUILD_TYPE

  // Clean + download assets if not localhost symlink
  if (buildtype !== 'localhost') {
    // Clear existing /public/generated/ of files + existing symlinks
    fs.remove('./public/generated/', (err) => {
      if (err) return console.err(err)
      console.log(
        `Removed existing vets-website assets. Preparing to download fresh from ${BUILD_TYPE_BUCKET[buildtype]}`
      )
    })

    await downloadFromLiveBucket(buildtype)
    console.log(
      `Successfully downloaded all assets listed in ${BUILD_TYPE_BUCKET[buildtype]}/${fileManifestPath}`
    )

    await moveAssetsFromVetsWebsite()
  }

  // Create symlink for localhost
  // if (buildtype === 'localhost') {

  // }
}

downloadAssets()
