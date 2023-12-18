const { processEnv } = require('env-loader')

const modifiedFiles = process.argv[2]
processEnv(`jest --findRelatedTests ${modifiedFiles} --passWithNoTests`)
