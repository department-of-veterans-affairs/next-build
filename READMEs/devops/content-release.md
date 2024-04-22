# Content Release

Content Release is what VA teams call the process of moving new published content in Drupal to [va.gov](https://va.gov).

See [CMS Content Release](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/cms-content-release.md) for more information on how content release is currently triggered via CMS for `content-build` and BRD.

In the short term, next-build will operate in very much the same way. When content is published in Drupal, a dispatch to our [content-release workflow](/.github/workflows/content-release.yml) will be triggered. This workflow builds all the static pages and assets currently known to next-build (as discovered by `RESOURCE_TYPES_TO_BUILD` in the catchall [slug file](/READMEs/slug.md)). It also generates a sitemap for these pages. Once the build process is completed, all of these items are pushed to the appropriate [S3 bucket](/READMEs/devops/infrastructure.md). Once the files are uploaded to S3, they are available for public traffic.

This workflow also happens whenever new code is merged to the main branch, to ensure the S3 bucket has the most up-to-date changes.

Right now, the workflow always runs using prod.cms.va.gov as it's data source and pushes output to the production next-content.www S3 bucket. If/when the workflow is parameterized to run against multiple targets (similar to how content-build builds `vagovdev`, `vagovstaging` and `vagovprod`), the sources and output buckets should also be adjusted.

# Archiving

Once a night, the current state of the front-end is archived to S3. This [archive workflow](/.github/workflows/archive.yml) behaves similarly to the content-release workflow described above, in that it also generates all static pages and their assets for use on S3. Once the build is complete, output is compressed to a `[git-hash].tar.gz` archive and pushed to separate S3 bucket for reporting purposes.

These archives ensure an easily available record of the state of VA.gov on any given day can be surfaced.
