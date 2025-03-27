# Description

What does this PR address?

## Generated description

(Select this text, hit the Copilot button, and select "Generate".)

## Ticket

<!--
https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue
-->

Closes _link to ticket_

## Developer Task

```md
- [ ] PR submitted against the `main` branch of `next-build`.
- [ ] Link to the issue that this PR addresses (if applicable).
- [ ] Define all changes in your PR and note any changes that could potentially be breaking changes.
- [ ] PR includes steps to test your changes and links to these changes in the Tugboat preview (if applicable).
- [ ] Provided before and after screenshots of your changes (if applicable).
- [ ] Alerted the #next-build Slack channel to request a PR review.
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

---

## Reviewer

### Reviewing a PR

This section lists items that need to be checked or updated when making changes to this repository.

## Standard Checks

```md
- [ ] Code Quality: Readabilty, Naming Conventions, Consistency, Reusability
- [ ] Test Coverage: 80% coverage
- [ ] Functionality: Change functions as expected with no additional bugs
- [ ] Performance: Code does not introduce performance issues
- [ ] Documentation: Changes are documented in their respective README.md files
- [ ] Security: Packages have been approved in the TRM
```

## Merging a Layout

When merging a layout, you must ensure that the content type has been turned on for `next-build` in the [.tugboat.env](../envs/.tugboat.env). This method mocks the CMS flag that must be turned on for a layout to be included in the build.

The layout component and matching resource type should be included in the [slug.tsx](../src/pages/[[...slug]].tsx), so that it can reviewed. Including a component in the slug.tsx does not mean a page will be viewable in production only on the tugboat for the branch.

When a layout is merged to main and approved for deployment, the prod CMS will turn the toggle on for the resource type. 

The status of layouts should be kept up to date inside [templates.md](../READMEs/templates.md). This includes QA progress, development progress, etc. A link should be provided for where testing can occur.