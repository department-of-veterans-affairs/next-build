# QA Smoke Tests for Next Build Daily Deployments

Our Next Build deployments to Staging will occur daily at 2pm ET, Monday - Friday. (Change introduced by [#23301](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/23301))

The CMS Team will be notified via slack alert ([test example](https://dsva.slack.com/archives/C06DSBT7CBW/p1770167535996639)) when the deployment has successfully completed in staging.

Before pushing our updates to Production, we want to verify that the following identified critical URLs are loading successfully:

1. [Homepage](http://www.va.gov/)
2. [Find a form](https://www.va.gov/forms/)
3. [Find a location](http://www.va.gov/find-locations)
4. [Check your claim, decision review, or appeal status](https://www.va.gov/claim-or-appeal-status/)
5. [Manage your health care with My HealtheVet](https://www.va.gov/health-care/manage-health)
6. [Get travel pay reimbursement](https://www.va.gov/health-care/get-reimbursed-for-travel-pay/)
7. [Review your payment history](https://www.va.gov/va-payment-history/)
8. [Download your benefit letters](https://www.va.gov/records/download-va-letters)
9. [Review your disability rating](https://www.va.gov/disability/view-disability-rating)
10. [Manage health appointments](https://www.va.gov/health-care/manage-appointments)
11. [Verify your school enrollment](https://www.va.gov/education/verify-school-enrollment)
12. [Check your remaining GI Bill benefits](https://www.va.gov/education/check-remaining-post-9-11-gi-bill-benefits)
13. [Review or update your dependents](https://www.va.gov/view-change-dependents)

## Phase 1 - Manual Smoke Test

- We will manually compare the identified critical URLs in staging to the same pages in production.
  - Kayla Watanabe, CMS PM, will conduct review between environments.
    - This will be a visual comparison to confirm that the pages load successfully and display the expected content.
    - **Out of scope:** These tests will not include testing functionality of each page. (i.e. broken links, accessibility)
  - If any issues are detected, CMS engineering support will be consulted to determine path of least resistance to unblock the deployment to production. (i.e. revert related PR or introduce quick fix)
  - If all critical URLs look good, CMS PM will reply to slack alert thread indicating that tests have passed and we can proceed with deployment to production.
- CMS eng support will then manually kick off the deployment to production.
  - Manual production deploy can be done by visiting the [Releases page](https://github.com/department-of-veterans-affairs/next-build/releases), and drafting a new release based off of the branch just tested on stage.

## Phase 2 - Automated Smoke Test + Manual intervention as needed

- With [#23421](https://github.com/department-of-veterans-affairs/va.gov-cms/issues/23421), we are exploring the option of introducing visual regression testing to confirm that the staging page looks the same as the production page.
  - If the visual regression detects any differences between the two environments, the team would be alerted to review the pages manually and confirm if the differences are expected or a potential bug was detected.
    - If differences are expected, deployment to production will be manually reviewed and approved.
    - If differences are unexpected and confirmed to be a bug, a ticket will be created to resolve the issue.
      - CMS PM will review differences and determine if engineering support is required.
      - If needed, CMS eng support will be consulted to determine path of least resistance to unblock the deployment to production. (i.e. revert related PR or introduce quick fix)
  - If the visual regression passes indicating that all pages are matching as expected, the deployment to Production will proceed without manual intervention.

## (Potential) Phase 3 - More Robust Automated Smoke Test

- In the future, we want to evaluate the potential for adding additional automation to our smoke tests, so that we could detect critical functional and accessibility issues.
  - We could incorporate the existing nightly a11y scan located [here](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/a11y.yml).
