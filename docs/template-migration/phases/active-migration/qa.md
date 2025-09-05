# QA Process

When a template is fully migrated and ready for QA, the associated QA ticket should be assigned and moved into the QA column on the [Next-build product board](https://github.com/orgs/department-of-veterans-affairs/projects/1464/views/1).

The QA ticket contains the specific items that must be reviewed and tested during this phase. 4 categories of items will be tested:

- Data
- Functionality
- Design
- Accessibility
- [Check for degraded page performance with a lighthouse scan](#how-to-check-for-degraded-page-performance)

For each item within the ticket, you will:

- Compare the completed next-build template using the main Tugboat environment\* to the existing content-build template on production VA.gov
- Confirm that the next-build template is consistent with the content-build template (or if there are differences, these were already known and agreed to during migration)

\*There are certain cases where the main next-build Tugboat may not be sufficient:

- If existing content does not cover enough scenarios for you to QA completely and you need to create additional test content, you can do this using CMS Tugboat.
- In certain cases, some content is not able to be displayed on next-build Tugboat. In these cases, another environment where you can see all the content and ensure everything is displaying and functioning correctly makes more sense.

[Refer to Testing on Tugboat and other environments](https://github.com/department-of-veterans-affairs/next-build/blob/main/docs/template-migration/phases/active-migration/testing-on-tugboat.md) for more information about these scenarios and how to complete your testing.

## Defects

During QA, a defect is considered to be any difference between the next-build and content-build template that has not already been accounted for and agreed to during the migration. If a defect is found, it must be ticketed.

Each QA defect ticket should be created as a subissue of the main QA ticket and should include:

- Detailed description of the issue
- What is the behavior in the next-build template vs. the expected behavior in the content-build template
- URLs for both the next-build and content-build pages
- Screenshots of the issue
  - This is important because if the content changes the issue can still be seen using these point-in-time images and recreated if necessary

Each defect should (ideally) be assigned to the engineer who did the original migration and then retested by the team member who did the QA and found the defect.

Once all defects have been resolved, the QA ticket can be closed and the template is ready for [Rollout](https://github.com/department-of-veterans-affairs/next-build/blob/main/docs/template-migration/phases/rollout.md).

## How to check for degraded page performance

- Make sure that your new page type is built by next-build and deployed on https://dev.va.gov/ but is still being built by content-build on prod
- Find example pages of the content type you are rolling out. You can use the [content page in drupal](https://prod.cms.va.gov/admin/content) to do that
- Pull up one of the pages on https://va.gov in an incognito chrome tab
- Right click on the page and select "inspect"
- Click the Lighthouse tab in the inspector
- Use Navigation (Default) mode, un-check Accessibility, Best practices & SEO, and choose Desktop
- Click Analyze page load
- In a new incognito tab, pull up the same page on https://dev.va.gov/
- Follow the same steps to run a Lighthouse test for the page on dev
- Compare the results of the two and if they are off by more than a couple points, run it again without doing other tasks (the results can vary)
- If the page is consistently off from the prod baseline, create a ticket to investigate
- Repeat the steps but choose Mobile as the device
- Check several different pages of the new type
- Attach results to the ticket
