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
  } catch (error) {
    console.error('Error creating symlink:', error)
  }

  try {
    const vamcEhrExists = await fs.pathExists(cmsDataPath)

    if (!vamcEhrExists) {
      // Grab data file populated by the cms
      await fetch('https://va.gov/data/cms/vamc-ehr.json')
        .then((res) => res.json())
        .then((data) => {
          fs.mkdirp(cmsDataPath)
            .then(() => {
              fs.writeJson(`${cmsDataPath}/vamc-ehr.json`, data)
              // eslint-disable-next-line no-console
              console.log('vamc-ehr data fetched successfully!')
            })
            .catch((err) => {
              console.error('Error with cms data directory: ', err)
            })
        })
        .catch((err) => {
          console.error('Error fetching cms data from va.gov: ', err)
        })
    } else {
      // eslint-disable-next-line no-console
      console.log('vamc-ehr data already exists.')
    }
  } catch (error) {
    console.error('Error fetching vamc-ehr data file:', error)
  }
})()
