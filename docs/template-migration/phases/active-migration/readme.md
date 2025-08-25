# Template Migration: Active Migration

## What is the Active Migration phase?

A template is in the Active migration phase when it's under development & QA but has not yet been deployed to production.

This is where the bulk of the work happens.

## What do we do here?

- The migrating team develops the new template in `next-build` to achieve parity with its current usage in production, including display, functionality and accessibility.
  - The team is also responsible for all communication about decisions made around known/expected differences between the `next-build` and the `content-build` templates
  - If there’s an intentional, significant mismatch between the `content-build` and `next-build` output (the HTML created), a ticket must be created which answers the following questions:
    - What is the difference?
    - Why was the decision made to not have 1:1 parity with the content-build template on this particular element/item?
    - Who signed off on the decision?
    - When was the decision made?
    - What is the impact to Veterans?
    - Should this be addressed in the future?
      - If no, the ticket can be closed and used only as a decision record for future reference
  - If there are intentional, minor differences between the current and migrated template, these can be noted within the ticket
- The migrating team completes full QA using the [QA process](https://github.com/department-of-veterans-affairs/next-build/blob/main/docs/template-migration/phases/active-migration/qa.md)

## How do we do it?

> [!IMPORTANT]
> 🏗️ This is a high-level overview of the process. See the linked references for more detailed information.

1. Find the template in `content-build`
   - This template will already be identified in the migration ticket
   - You'll use this to see the logic and structure to use in the next-build template
1. Find a page that uses the template in `content-build`
   - Within each migration subissue, multiple example URLs for the template will be provided
1. Create a new template in `next-build` to match the `content-build` template if one doesn't already exist and make the necessary changes to the `next-build` template to achieve parity with the `content-build` template
   - For a more detailed explanation of how the build process works, refer to [How to migrate a page template in chunks](https://github.com/department-of-veterans-affairs/next-build/blob/main/docs/template-migration/phases/active-migration/guide-to-iterative-development.md)
1. When all migration subissues are completed, the migration ticket can be closed and this will move into QA following the [QA process](https://github.com/department-of-veterans-affairs/next-build/blob/main/docs/template-migration/phases/active-migration/qa.md)

> [!NOTE]
> See also: [Guide to leveraging AI for template migration](../guide-to-leveraging-ai.md).

## RACI

- **Responsible:** CMS Team, Sitewide Team
  - Determined by the team that commits to completing the work.
  - Ownership is communicated to the CMS team by the committed team.
- **Accountable:** Chris Valarida & Laura Flannery (CMS Team)
- **Consulted:** (CMS Team)
- **Informed:** Any team not in the Responsible role

## Transitioning to Rollout

**Trigger**: The template achieves 1:1 parity with production or meets an agreed-upon snapshot baseline. (Determined by QA testing.)

**Next step:** [Rollout](../rollout.md)
