**Product description**

**Background**

- [Next Build](https://github.com/department-of-veterans-affairs/next-build) is a front end framework for VA.gov CMS-based content. It is built on top of Next.js. The purpose of Next Build is to replace the legacy [Content Build](https://github.com/department-of-veterans-affairs/content-build) system. The reasons for replacing Content Build are twofold:

  - The architecture of Content Build only lends itself to static site generation of the entire body of CMS content at once. This requires Content Build to be run repeatedly through the day to keep VA.gov reflecting up-to-date CMS content. This is a slow process and causes significant delay between a CMS user creating and saving content and it being available to the end-user.
  - The frontend templating framework which Content Build, Liquid, is outdated, not well supported, and not well known. This makes developing for the system confusing and requires incoming frontend developers to acclimate to an unusual sysvtem.

- The first step of the Next Build project, which is already complete, is to migrate some templates for CMS content from Content Build to Next Build, and to set up static site generation using those new templates. At the time of writing we have migrated the templates for about 47% of all CMS content to Next Build for production use, and a significant additional portion of the site is ready to be used in production once approved.

**Current effort**

- The second step to the Accelerated Publishing work (and the focus of this architecture intent) will be to implement a persistent server that will allow content to be published from Drupal CMS to VA.gov much more quickly; we are estimating ~5 minutes from when content is updated in Drupal CMS to updated in VA.gov. This is because the server will be triggered to rebuild the pages after a predetermined amount of time.
- We will be using a Next.js Server to perform Incremental Static Regeneration (ISR) for content pages. [Incremental Static Regeneration (ISR)](https://nextjs.org/docs/pages/guides/incremental-static-regeneration) in Next.js is a hybrid rendering strategy that combines the performance benefits of Static Site Generation (SSG) with the flexibility of dynamic content updates. It allows you to update static content on your Next.js application without requiring a full rebuild and redeployment of the entire site.
- Additional Documentation:
  - [Static Site Generation Summary and Recommendation](https://dvagov.sharepoint.com/:w:/r/sites/CMSTeam/Shared%20Documents/Static%20Site%20Generation%20Summary%20and%20Recommendation.docx?d=w98220445f4ca467c834cde562b977d3c&csf=1&web=1&e=WZTeUn)
  - [Accelerated Publishing System Design](https://dvagov.sharepoint.com/:w:/r/sites/CMSTeam/Shared%20Documents/%5BFinal%5D%20On%20Demand%20Publishing_%20Performance%20and%20Load%20Testing.docx?d=w8e43b417534d437d927dabc7cc50f1e3&csf=1&web=1&e=1kKjId)

**UX design description**

- N/A

**Frontend changes**

- N/A

**Backend changes**

- We are introducing a Node.js server that runs [Next.js](https://nextjs.org/) for generating and serving web pages using Drupal as their data source.
- An additional logic step will be added to the RevProxy to send a request to Next.js Server.
  - **<span style="color: #00a700ff;">ON SUCCESS</span>**: Content page will be returned to the user
  - **<span style="color: #d60000ff;">ON FAILURE</span>**: The RevProxy will continue its normal operation to serve the content page from the existing S3 Storage options as it does today.
- The failover logic currently being used in production determines if a content page is available in the Next.js S3 Storage, and falls back to Content Build S3 storage if not. In our proposed changes, if the Next.js server does not return a success response, the URL will fall back to static S3 storage.
- More detailed information on this is available in the [Accelerated Publishing System Design](https://dvagov.sharepoint.com/:w:/r/sites/CMSTeam/Shared%20Documents/%5BFinal%5D%20On%20Demand%20Publishing_%20Performance%20and%20Load%20Testing.docx?d=w8e43b417534d437d927dabc7cc50f1e3&csf=1&web=1&e=1kKjId) Documentation.

**Does the project introduce any new connections or exchanges of new information types with other systems? (e.g. "new" meaning a new connection of type of information not already present in vets-api)**

- N/A

**Do you need to poll any APIs for status? How is API success or failure determined?**

- Monitoring will be done with Datadog and alerts will be generated if tolerances are exceeded or connection issues are detected.
- **<span style="color: #00a700ff;">Success</span>** is a 200 code returned from Drupal and a successful page build by Next.js
- **<span style="color: #d60000ff;">Failure</span>** is code other than 200 from Drupal or if Next.js fails to generate the page. The failover logic will then be invoked to ensure a reliable and resilient user experience
  - If a failure occurs the pages will be served from S3 Storage

**Are you handling all failure and error cases while in custody of your users's data?**

- N/A - We have **NO** User Data

**Does this update change shared code?**

- **Yes**
  - We are adding logic in the RevProxy. This logic has been and will be part of our testing. RevProxy stability is an absolute top priority.

**What information will be captured in logs or metrics?**

- No user data will be captured in logs or metrics. We are not handling user data.

**Does this project/update involve user-uploaded data?**

- N/A

**Are user-uploaded files being scanned for viruses?**

- N/A

**Does this project/update generate intermediate or "temporary" files during processing? If so, where and how are the temporary files materialized? What is the cleanup/removal process or mechanism?**

- N/A

**Internal API changes**

- Drupal's JSON:API will continue to provide data for Next.js server-side rendered pages, as it currently does for statically rendered pages.
- The [next-drupal](https://next-drupal.org/) library provides a client for working with [Drupal's JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module) functionality.

**List new or modified APIs in vets-api**

- N/A

**Are you deprecating or removing any APIs?**

- No

**Do you have API documentation?**

- We have Readme documentation in our Next.js repository to assist developers in retrieving the information needed for the content types in Drupal
- Drupal has documentation for its [JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module)
- Our [CMS implementation's API is documented](https://prod.cms.va.gov/admin/config/services/openapi/swagger/va_gov_json_api) (account required)
- [next-drupal](https://next-drupal.org/) has documentation for the Drupal Client

**Describe expected call patterns**

- Requests made to our content pages on VA.gov will be routed through the RevProxy. The RevProxy contains the logic for determining if the request will be successful from Next.js or S3 Storage.
- We will be using caching, Kubernetes and horizontal scaling for expected spikes in traffic
- We are currently working on our performance monitoring, configuration and testing

**Are there new endpoints or services that require rate limiting or throttling?**

- N/A - We have no publicly exposed API endpoints.

**Are there any third party integrations, and how are they vetted?**

- N/A - Next.js and Drupal are hosted internally. No third party integrations are used.

**Are there any new scheduled/cron jobs? If so, how are their intervals and impact considered? (especially with regard to periods of higher traffic or times when Sidekiq and infrastructure is already handling a high volume of jobs?)**

- N/A

**Is schema validation enforced (ex: using the vets-json-schema repo)?**

- N/A

**External API changes**
**List new or modified APIs for upstream or external systems**

- N/A
  **Describe expected call patterns**
- N/A

**What PII or PHI will be transmitted to/from the external systems?**

- N/A - Accelerated Publishing will not impact any external API

**Background jobs**

- None

**List any required background processing**

- None

**Describe error and dead letter handling**

- N/A

**Data storage**

- N/A

**Describe new or modified databases, tables or columns**

- N/A - Drupal DB already exists and in use. No modifications are needed for this rollout.

**Describe indexes and constraints**

- N/A

**Identify PII and PHI and where and how it will be stored, processed, expired and deleted**

- N/A

**Is this change introducing a large or new volume of data?**

- No

**Do these changes impact database or caching layers (ex: Redis, Postgres)?**

- No

**Do the changes have implications for data volume, memory, or CPU usage to consider?**

- There are 2 systems: Next.js and Drupal. These are completely separate applications from vets-api and other VA applications.
- Currently testing performance and capacity for memory, CPU, and network
- Currently making adjustments based on our first results of chaos testing.
- Implementing improved caching and increasing horizontal scaling

**Does this project/update expect to persist information? What is the expiration policy for data added to the system? What is the cleanup/removal process or mechanism?**

- We are not introducing any new systems that persist information.

**Libraries and dependencies
List new or updated dependencies**

- None

**Metrics, logging, observability, alerting
Identify key areas to monitor**

- Next.js Server - Deployed on EKS Cluster
- Drupal Server - Deployed to EC2 Instance (EKS Cluster in the future)

**Are you introducing any custom metric tags?**

- No

**Have you considered their cost and potential cardinality? High cardinality = higher cost**

- N/A

**Are there any sensitive data risks with logging?**

- No

**Infrastructure and network changes
List any changes or additions**

- **Next.js Server** in an EKS Cluster. Currently deployed to all environments (Dev, Stage, Prod-Mirror (Not accessible by public currently))
- **Drupal Server** currently being used in Production for Internal Content Authors. Deployed to EC2 Instance; EKS Cluster coming Q1 2026

**Test strategy**

**Describe automated, manual and user acceptance test strategy**

- CI/CD Automated tests for frontend functionality using jest and playwright
- Manual User Testing using Tugboat Preview Environments
- Full build of all content pages for regression and integration testing prior to production deployment.

**Describe required test data and test user accounts**

- No test Accounts required
- Next build uses mocked data for its internal unit and functional tests

**Rollout plan**

- Scope:
  For the rollout, we will begin with a pilot launch, where the team will launch a small subset of pages published through Drupal to confirm that On Demand Publishing is working as expected, while minimizing any impact to Veterans if there are any problems. The scope of the pilot will be VA Tampa system’s Story and Story Listing Pages (Stories | VA Tampa health care | Veterans Affairs) because these pages have low engagement (22,698 views / 0.2% of total VAMC page views), do not contain critical information to veterans, but the content on these pages are regularly updated, so we can validate that on demand is working as expected.

- Teams to Coordinate with:
  The CMS team will be coordinating with both platform support and watchtower, as teams to alert CMS if there are any issues during the pilot.

- Rollback Plan:
  This deployment will be dependent on the update of routing logic to the RevProxy. In an event where we need to rollback the change, we will need to revert the code change in the RevProxy. This has already been successfully tested in the Dev Environment during Chaos Testing.

**Internal administration tasks**

- Maintenance and Tasks
  - Next.js server JavaScript libraries to apply updates as needed
  - Drupal server code updates, including PHP library updates.
  - Both of these maintenance tasks are already being performed on a regular basis.
  - Currently dependabot assists us in applying appropriate updates and our support rotation reviews and updates the code.
  - Updates are performed within Github and go thru automated regression testing using our CI/CD pipeline
