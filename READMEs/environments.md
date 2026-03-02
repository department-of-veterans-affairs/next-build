# VA.gov environments and Next Build

## VA.gov usage

VA.gov has 3 environments it uses:

- Production ([www.va.gov](https://www.va.gov)), the main version of the site that the public uses
- Staging ([staging.va.gov](https://staging.va.gov)), a version of the site that is a production-like build of the current code state across repos
- Dev ([dev.va.gov](https://dev.va.gov)), a version of the site that is the current code state across repos but unoptimized to allow easier readability and troubleshooting for developers

These sites represent the collective work of the following repos:

- [vets-website](https://github.com/department-of-veterans-affairs/vets-website)
- [vets-api](https://github.com/department-of-veterans-affairs/vets-api)
- [va.gov-cms](https://github.com/department-of-veterans-affairs/va.gov-cms)
- [next-build](https://github.com/department-of-veterans-affairs/next-build)
- [content-build](https://github.com/department-of-veterans-affairs/content-build)
- [vsp-platform-revproxy](https://github.com/department-of-veterans-affairs/vsp-platform-revproxy)
- Others

## Next Build environment specifics

Next Build creates and deploys content changes to each of these environments. In each environment, there are several things that shape that content:

- intended use of the environment
- next-build code version
- code deploy schedule
- CMS acting as backend
- content release schedule
- CMS feature toggles

### Production

Production is the environment the public interacts with. It must be well-tested and in a stable state.

Next Build code on production is defined by a [release tag](https://github.com/department-of-veterans-affairs/next-build/tags). A release tag is created from a release branch which has been tested on the Staging environment.

Production release tags are created and put into use once daily. The exact time will depend on length of testing on Staging. Generally new code will be put into use between 2:30 - 3:00 pm ET. Creation of release tags is subject to code freeze at holidays.

Next Build on Production uses the Production CMS at https://prod.cms.va.gov/ as its content data source. Content changes are released to Production continually between 8:00 am - 8:00 pm ET, Monday - Friday. Content changes may be deployed outside that timeframe to publish time-sensitive content like facility situation updates and banners. Content release is _not_ subject to code freeze at holidays.

The CMS feature toggles in use on Production match what is defined in the Production CMS. No feature toggle overrides are defined in code for the Production environment.

### Staging

Staging is used for review of new code releases. It either matches Production or it contains code that is about to go to Production. Pre-deployment [smoke test QA](https://github.com/department-of-veterans-affairs/next-build/blob/main/READMEs/smoke-tests.md) is done on Staging. Additionally, major feature launches may trigger additional QA.

Staging may also be used for testing of Next Build that requires a Production-like build. Vets-website in particular builds an optimized and minified version of its code for its Staging deployments. It may be necessary to test Next Build performance on Staging, since the JavaScript is comparable to Production.

Staging code is defined by a [release branch](https://github.com/department-of-veterans-affairs/next-build/branches/all?query=release%2F) created from the `main` branch in preparation for a Production deploy. The release branch is created as the first step of Production deploy.

Release branches are created at 2:00 pm ET each day and used to release content to Staging. This release is QA'd prior to Production deployment on Staging. Release branch creation is subject to code freeze.

Next Build on Staging uses the [CMS Mirror](https://mirror.cms.va.gov/) as its data source. CMS Mirror syncs code and content from CMS Production each night. It is not guaranteed to perfectly match Production, but it is close enough for the QA work that we do on Staging.

Content release to Staging happens as part of the Staging deploy process. Additionally, we will do a content release to Staging nightly to ensure that its content is kept up-to-date with Production.

The CMS feature toggles in use on Staging match what is defined in the CMS Mirror, which is synced from Production each night. No feature toggle overrides are defined in code for the Staging environment in order that Staging behavior match Production as closely as possible.

### Dev

Dev is the environment that represents the current state of the codebase. It may contain code that has not been released to Production yet, and it may behave differently from Production.

Next Build code on Dev is deployed every time a PR is merged to the `main` branch and CI is successful for `main`. Dev therefore may be deployed several times a day, and should always be using the current version of `main`.

Next Build on Dev uses the [CMS Mirror](https://mirror.cms.va.gov/) as its data source. CMS Mirror syncs code and content from CMS Production each night. It is not guaranteed to perfectly match Production, but it is close enough for any testing work that we do on Dev.

Content release for Dev is done after each merge to `main`. Additionally, Dev content release happens nightly in order to keep Dev content up-to-date with Production.

The CMS feature toggles in use on Dev match what is set in the CMS Mirror. Additionally, Dev may set feature toggle overrides and other environment variable differences. This is primarily done to test new template types that are merged to the Next Build code base but are behind feature toggles on Staging and Production.
