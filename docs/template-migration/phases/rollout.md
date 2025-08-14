# Template Migration: Rollout

## What is the Rollout phase?

A template is in the Rollout phase when QA is complete and the template is ready to be used to generate and display content in production.

## What do we do here?

The tasks within this phase are owned by the CMS team, regardless of which team did the migration.

- Prelaunch prep:
  - Confirm all defects found during QA have been resolved and closed
  - Determine launch date
  - Confirmation of launch with stakeholders: 
    - Erika Washburn
    - Sitewide Team Product
- Communication
  - Slack messages posted in:
    - `#next-build`
    - `#platform-cms-team`
    - `#cms-support` ping `@cms-helpdesk` specifically
    - `#sitewide-program`
  - ToT announcement
- Launch to production

## How do we do it?

- In Production CMS, assign feature flag and clear cache:
  - [Feature Toggle list](https://prod.cms.va.gov/admin/config/system/feature_toggle). Make sure you are checking the correct feature toggle for the template that is launching
  - [Clear Cache](https://prod.cms.va.gov/admin/config/development/performance). Select the “Clear all caches” button
- Check CMS Preview of template pages (engineering task):
  - Reload Preview server
    - Go to ArgoCD: https://argocd.vfs.va.gov/
    - Find next-build-prod: https://argocd.vfs.va.gov/applications/next-build-prod?view=tree&resource=kind%3ADeployment
    - Filter 'Kinds' (left edge) to 'Deployment' (may already be set by link above)
    - Find 'next-build' labeled with 'deploy'
    - Select 'Restart' from the 3 dot menu
    - Wait about 2-3 minutes
  - Confirm that the new content type is available to preview and that existing next-build content types are still previewing correctly
- Test and QA the launched content template:
  - Wait for the Next Build Content Release to complete
  - Confirm that the content is now loading from next-build
    - Go to the page on VA.gov
    - Open your network tab
    - Reload the page
    - Click on the page URL over in the Name column
    - Then in Headers find `X-Ap-Debug-Message` under Response headers
      - It should say “Processed by @nextcontent location”
      - If it says “Processed by @content location” you may need to wait for the next content release. If it still isn’t loading through next, confirm that the correct feature toggle was set
  - Perform QA of template pages
  - Perform QA of key VA.gov pages (e.g. homepage)

## RACI

- **Responsible:** Laura Flannery (CMS Team)
- **Accountable:** CMS Team
- **Consulted:**
  - Tim Cosgrove
  - Product-owning Team
- **Informed:**
  - Help Desk
  - Larger VA ecosystem comms

## Transitioning to Post-Launch

**Trigger:** The template has launched successfully.

**Next step:** [Post-Launch](./post-launch.md)
