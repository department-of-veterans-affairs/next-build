// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra')
const path = require('path')

const target = path.resolve('../vets-website/build/localhost/generated')
const symlinkPath = path.resolve(__dirname, '..', 'public', 'generated')
const cmsDataPath = path.resolve(__dirname, '..', 'public', 'data', 'cms')

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

    // Grab data file populated by the cms
    fetch('https://va.gov/data/cms/vamc-ehr.json')
      .then((res) => res.json())
      .then((data) => {
        fs.mkdirp(cmsDataPath)
          .then(() => {
            fs.writeJson(`${cmsDataPath}/vamc-ehr.json`, data)
          })
          .catch((err) => {
            console.error('Error with cms data directory: ', err)
          })
      })
      .catch((err) => {
        console.error('Error fetching cms data from va.gov: ', err)
      })
  } catch (error) {
    console.error('Error creating symlink:', error)
  }
})()
