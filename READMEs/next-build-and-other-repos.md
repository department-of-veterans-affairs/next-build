# Developing for Next Build with other repos

Next Build is always working in conjunction with code in other repos. The two most common repos used alongside Next Build are

- the [VA Drupal CMS](https://github.com/department-of-veterans-affairs/va.gov-cms)
- [vets-website](https://github.com/department-of-veterans-affairs/vets-website), the frontend repository for VA web applications

If your Next Build work does not require changes in the CMS or in vets-website, your local and Tugboat testing environments will work "as-is". However, if you need to coordinate work in more than one repo, there are things to look out for and some workarounds from problems that are not yet solved.

## vets-website

### Local development

Next Build is able to import files from a local vets-website instance, which should have been set up in parallel with your Next Build local installation. However, if you are creating and testing local changes in vets-website, your local Next Build will not automatically import your changes as you make them.

In order to see and test local vets-website changes in a local Next Build environment, please follow these steps:

1. In vets-website, set up your local development server with `yarn dev`.
1. Work on your vets-website changes, and get them to the point where you feel you can test them.
1. Within vets-website, make sure that you are running the correct node version (`nvm use` within the vets-website directory) and then run `yarn build`. This generates the files that Next Build will import.
1. Within Next Build, make sure you are running the correct node version (`nvm use` within the next-build directory) and then run `BUILD_TYPE=localhost yarn setup`. `BUILD_TYPE=localhost` is necessary here; otherwise, your local Next Build will source its files from the Next Build production build.
1. Within Next Build, run `yarn dev` and visit the URL where you are doing your testing in Next Build. You should see your updated changes to the vets-website widget or application you were working on.
1. If you need to make changes or adjustments, return to the first step and follow code change and build step again.

At this time, the local build of vets-website assets and their import into local Next Build is necessary. In the future we hope to allow vets-website files to be watched in the same way that Next Build watches its own local files during development.

### Tugboat testing

Currently, there is no provision on Tugboat for using a non-`main` branch of vets-website. In order for testing of vets-website changes to be tested on Next Build Tugboat, the vets-website changes need to be merged to that `main` branch.

## VA CMS

<!-- adding these here to be filled out later -->

### Local Development

### Tugboat testing
