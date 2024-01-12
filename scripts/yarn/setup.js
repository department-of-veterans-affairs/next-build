// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra')
const path = require('path')

const target = path.resolve(
  __dirname,
  '..', // extra .. here to get out of next-build
  '..',
  '..',
  'vets-website',
  'build',
  'localhost',
  'generated'
)
const symlinkPath = path.resolve(__dirname, '..', '..', 'public', 'generated')

;(async () => {
  try {
    // Checks if symlink already exists
    const exists = await fs.pathExists(symlinkPath)

    if (!exists) {
      await fs.ensureSymlink(target, symlinkPath, 'dir')
      // eslint-disable-next-line no-console
      console.log('Symlink created successfully!')
    } else {
      // eslint-disable-next-line no-console
      console.log('Symlink already exists.')
    }
  } catch (error) {
    console.error('Error creating symlink:', error)
  }
})()
