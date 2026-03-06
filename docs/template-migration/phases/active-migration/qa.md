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

Use the [Lighthouse Testing Tool](https://github.com/pwolfert/lighthouse-testing-tool) to run Lighthouse CI performance tests and compare before/after states when a template is turned on or off.

### Setup

1. Clone the tool: `git clone https://github.com/pwolfert/lighthouse-testing-tool`
2. Install dependencies: `pnpm install`
3. Reset the database: `pnpm reset`
4. Start the LHCI server (in a separate terminal): `pnpm start` — the UI will be at http://localhost:9001/

### Testing a template

1. **Find example URLs** for the template you're testing on the staging environment (e.g., https://staging.va.gov/ or https://dev.va.gov/).

2. **Run baseline tests** (template off) — use the default `main` branch so comparisons work:

   ```bash
   pnpm test https://staging.va.gov/your-page-url/ --branch="main"
   ```

3. **Run experimental tests** (template on) — use a descriptive branch name:

   ```bash
   pnpm test https://staging.va.gov/your-page-url/ --branch="template-on"
   ```

4. **Repeat** each test multiple times at different times of day for a better statistical sample.

5. **Analyze results**:

   ```bash
   pnpm analyze
   ```

   This generates CSV files in `analysis/` and displays statistics in the console.

6. **Compare** results in the LHCI web UI at http://localhost:9001/ or via the generated CSV files. If performance is consistently worse with the template on, create a ticket to investigate.

7. **Log results** in our performance-scores database here in our next-build project at http://localhost:3999/\_playground/performance/ (Next.js dev server must be running).
