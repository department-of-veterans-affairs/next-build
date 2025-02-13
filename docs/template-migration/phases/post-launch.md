# Template Migration: Post-Launch

## What is the Post-Launch phase?

The Post-Launch phase is the final phase of the template migration process. At this point, the template is used in production. Herein are the last few steps before the Product-owning Team takes over ownership of the template from the CMS Team.

## What do we do here?

- Removal of the old content-build templates 1 full sprint after a successful launch to production
  - When: 1 full sprint after a successful launch to production
  - Who: Owned exclusively by the CMS team, regardless of which team did the migration of the template
  - What:
    - Clear list of all content-build templates being replaced including all layouts and shared components
    - Determine what the “content-build removal” entails:
      - Query removal?
      - CSS removal?
      - Full Template/layout removal? Or just adding a comment at the top indicating that the layout should not be used and has been migrated to next-build?
- Verification of prod behavior after content-build template removal
  - Owned by the team migrating the template
- Final handoff to the Product-owning Team

## How do we do it?

1. Verify the behavior of the template in production
1. Create a PR to update the CODEOWNERS file, formalizing the handoff of accountability from the CMS Team to the Product-owning Team

## RACI

- **Responsible:** The CMS team & the team doing the migration
- **Accountable:** Chris Valarida _(CMS Team)_
- **Consulted:** Product-owning Team
- **Informed:** Product-owning Team

## Maintenance and Enhancements

_Congratulations! You've made it!_

The template is now in production and the Product-owning Team is responsible for maintaining and enhancing the template.
