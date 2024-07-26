# PR Checklist

## Background

VA.gov depends on the documentation in Next-Build to be accurate and up to date in order to properly maintain our application and keep other teams informed. The PR checklist should be referenced when doing any PR review to ensure that all relevant tests and necessary changes have been made. Overlooking one of these tasks could potentially lead to a site outage.

## Submitting a PR

- PRs should be submitted against the `main` branch of `next-build`.
- Your PR should link to the issue that this PR addresses (if applicable).
- Define all changes in your PR and note any changes that could potentially be breaking changes.
- PRs must include steps to test your changes and links to these changes in the Tugboat preview (if applicable).
- Provide before and after screenshots of your changes (if applicable).
- Alert the #accelerated-publishing Slack channel to request a PR review.
- Once approved, you are responsible for merging your changes into `main`. (Note that changes to `main` will move automatically into production.)

### Reviewing a PR

This section lists items that need to be checked or updated when making changes to this repository.

## Standard Checks

- Code Quality: Readabilty, Naming Conventions, Consistency, Reusability
- Test Coverage:
- Functionality:
- Performance:
- Documentation:
- Security: Make sure libraries have been approved in the TRM

## Deploying an approved Layout

When deploying a layout, you must ensure that the content type has been turned on for `next-build` inside the `CMS`. This CMS flag must be turned on for editors to preview their work using the next build preview server.

Resource types (layouts) that have not been approved by design should NOT be pushed to production. Ensure that [slug.tsx](../src/pages/[[...slug]].tsx) does not include your resource type if it is not approved.

The status of layouts should be kept up to date inside [templates.md](./templates.md). This includes QA progress, development progress, etc. A link should be provided for where testing can occur.

## Developing a Non-Approved Layout

Your new resource type should not be included inside [slug.tsx](../src/pages/[[...slug]].tsx). Items added here will go into production once merged into the `main` branch. It is imperative that we do not push anything live that has not been approved.

Ensure that this layout has been added to the [templates.md](./templates.md) file with the current status of the work.
