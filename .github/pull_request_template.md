# Description
What does this PR address?

## Ticket
Relates to #[TICKET_NUMBER](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/TICKET_NUMBER). (or closes?)

## Developer Task

```[tasklist]
- [ ] PR submitted against the `main` branch of `next-build`.
- [ ] Link to the issue that this PR addresses (if applicable).
- [ ] Define all changes in your PR and note any changes that could potentially be breaking changes.
- [ ] PR includes steps to test your changes and links to these changes in the Tugboat preview (if applicable).
- [ ] Provided before and after screenshots of your changes (if applicable).
- [ ] Alerted the #accelerated-publishing Slack channel to request a PR review.
- [ ] You understand that once approved, you are responsible for merging your changes into `main`. (Note that changes to `main` will move automatically into production.)
```

## Testing Steps
Explain the steps needed for testing

## QA steps
What needs to be checked to prove this works?  
What needs to be checked to prove it didn't break any related things?  
What variations of circumstances (users, actions, values) need to be checked?

## Screenshots
Before:
After:


## Is this PR blocked by another PR?
- Add the `DO NOT MERGE` label
- Add links to additional PRs here:


# Reviewer

### Reviewing a PR

This section lists items that need to be checked or updated when making changes to this repository. 

## Standard Checks

```[tasklist]
- [ ] Code Quality: Readabilty, Naming Conventions, Consistency, Reusability
- [ ] Test Coverage: 80% coverage
- [ ] Functionality: Change functions as expected with no additional bugs
- [ ] Performance: Code does not introduce performance issues
- [ ] Documentation: Changes are documented in their respective README.md files
- [ ] Security: Packages have been approved in the TRM
```

## Merging an Approved Layout

When merging a layout, you must ensure that the content type has been turned on for `next-build` inside the `CMS`. This CMS flag must be turned on for editors to preview their work using the next build preview server.

Resource types (layouts) that have not been approved by design should NOT be pushed to production. Ensure that [slug.tsx](../src/pages/[[...slug]].tsx) does not include your resource type if it is not approved.

The status of layouts should be kept up to date inside [templates.md](./templates.md). This includes QA progress, development progress, etc. A link should be provided for where testing can occur.

## Merging a Non-Approved Layout

Your new resource type should not be included inside [slug.tsx](../src/pages/[[...slug]].tsx). Items added here will go into production once merged into the `main` branch. It is imperative that we do not push anything live that has not been approved.

Ensure that this layout has been added to the [templates.md](./templates.md) file with the current status of the work.