import fs from 'fs'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import Debug from 'debug'

const debug = Debug('ept:diff')

export interface DiffResult {
  diffPixels: number
  totalPixels: number
  diffPercent: number
  width: number
  height: number
}

export interface DiffOptions {
  imageAPath: string
  imageBPath: string
  diffOutputPath: string
  threshold: number
}

/**
 * Read a PNG file and return PNG object
 */
function readPNG(filePath: string): PNG {
  const buffer = fs.readFileSync(filePath)
  return PNG.sync.read(buffer)
}

/**
 * Resize image to target dimensions by creating a new canvas
 * Smaller images are placed at top-left, excess area is transparent
 */
function resizeToMatch(
  img: PNG,
  targetWidth: number,
  targetHeight: number
): PNG {
  if (img.width === targetWidth && img.height === targetHeight) {
    return img
  }

  const resized = new PNG({ width: targetWidth, height: targetHeight })

  // Fill with transparent pixels
  resized.data.fill(0)

  // Copy original image data
  for (let y = 0; y < Math.min(img.height, targetHeight); y++) {
    for (let x = 0; x < Math.min(img.width, targetWidth); x++) {
      const srcIdx = (img.width * y + x) * 4
      const dstIdx = (targetWidth * y + x) * 4
      resized.data[dstIdx] = img.data[srcIdx]
      resized.data[dstIdx + 1] = img.data[srcIdx + 1]
      resized.data[dstIdx + 2] = img.data[srcIdx + 2]
      resized.data[dstIdx + 3] = img.data[srcIdx + 3]
    }
  }

  return resized
}

/**
 * Compare two images and generate a diff image
 */
export function compareImages(options: DiffOptions): DiffResult {
  const { imageAPath, imageBPath, diffOutputPath, threshold } = options

  debug(`Comparing images: ${imageAPath} vs ${imageBPath}`)

  let imgA = readPNG(imageAPath)
  let imgB = readPNG(imageBPath)

  // Handle size differences by resizing to max dimensions
  const maxWidth = Math.max(imgA.width, imgB.width)
  const maxHeight = Math.max(imgA.height, imgB.height)

  if (imgA.width !== maxWidth || imgA.height !== maxHeight) {
    debug(
      `Resizing image A from ${imgA.width}x${imgA.height} to ${maxWidth}x${maxHeight}`
    )
    imgA = resizeToMatch(imgA, maxWidth, maxHeight)
  }

  if (imgB.width !== maxWidth || imgB.height !== maxHeight) {
    debug(
      `Resizing image B from ${imgB.width}x${imgB.height} to ${maxWidth}x${maxHeight}`
    )
    imgB = resizeToMatch(imgB, maxWidth, maxHeight)
  }

  // Create diff image
  const diff = new PNG({ width: maxWidth, height: maxHeight })

  // Run pixelmatch comparison
  const diffPixels = pixelmatch(
    imgA.data,
    imgB.data,
    diff.data,
    maxWidth,
    maxHeight,
    {
      threshold,
      includeAA: false,
    }
  )

  // Write diff image
  fs.writeFileSync(diffOutputPath, PNG.sync.write(diff))
  debug(`Diff image saved: ${diffOutputPath}`)

  const totalPixels = maxWidth * maxHeight
  const diffPercent = (diffPixels / totalPixels) * 100

  return {
    diffPixels,
    totalPixels,
    diffPercent,
    width: maxWidth,
    height: maxHeight,
  }
}
