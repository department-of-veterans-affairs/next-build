# Template Migration: Active Migration

## What is the Active Migration phase?

A template is in the Active Migration phase when it's...y'know, under active development & testing but has not yet been deployed to production.

_This is where the bulk of the work happens._

## What do we do here?

> [!NOTE]
> 🏗️ We'll move some of this information into the how-to guides as we get them written.

- The responsible team develops the new template in `next-build` to achieve parity with its current usage in production, including display, functionality and accessibility.
  - The team is also responsible for all communication about decisions made around known/expected differences between the `next-build` and the `content-build` templates
  - If there’s an intentional mismatch between the `content-build` and `next-build` output (the HTML created), a ticket must be created which answers the following questions:
    - What is the difference?
    - Why was the decision made to not have 1:1 parity with the content-build template on this particular element/item?
    - Who signed off on the decision?
    - When was the decision made?
    - What is the impact to Veterans?
    - Should this be addressed in the future?
      - If no, the ticket can be closed and used only as a decision record for future reference
- The responsible team completes full QA using the QA template

## How do we do it?

> [!IMPORTANT]
> 🏗️ This is a high-level overview of the process. Each step will have its own documentation that you can reference for more detailed information. Coming soon to a PR near you!

1. Find the template in `content-build`
   - You'll use this to see the logic and structure to use in the `next-build` template
1. Find a page that uses the template in `content-build`
1. Create a new template in `next-build` to match the `content-build` template if one doesn't already exist
1. Make the necessary changes to the `next-build` template to achieve parity with the `content-build` template
1. Test the template in `next-build`
   - Something about using the `FEATURE_NEXT_BUILD_CONTENT_ALL=true` environment variable
1. Get QA approval

## RACI

- **Responsible:** CMS Team, Sitewide Team
  - Determined by the team that commits to completing the work.
  - Ownership is communicated to the CMS team by the committed team.
- **Accountable:** Chris Valarida _(CMS Team)_
- **Consulted:** Laura Flannery _(CMS Team)_
- **Informed:** Any team not in the Responsible role

## Transitioning to Rollout

**Trigger**: The template achieves 1:1 parity with production or meets an agreed-upon snapshot baseline. (Determined by QA testing.)

**Next step:** [Rollout](./rollout.md)
