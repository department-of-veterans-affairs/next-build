**Product description**

- The second step to the Accelerated Publishing work will be to implement a persistent server that will allow content to be published from Drupal CMS to VA.gov much more quickly; we are estimating ~5 minutes from when content is updated in Drupal CMS to updated in VA.gov. This is because the server will be triggered to rebuild the pages after a predetermined amount of time.
- We will be using a Nextjs Server to performa Incremental Static Regeneration (ISR) for content pages. [Incremental Static Regeneration (ISR)](https://nextjs.org/docs/pages/guides/incremental-static-regeneration) in Next.js is a hybrid rendering strategy that combines the performance benefits of Static Site Generation (SSG) with the flexibility of dynamic content updates. It allows you to update static content on your Next.js application without requiring a full rebuild and redeployment of the entire site.
- Additional Documentation:
  - [Static Site Generation Summary and Recommendation](https://dvagov.sharepoint.com/:w:/r/sites/CMSTeam/Shared%20Documents/Static%20Site%20Generation%20Summary%20and%20Recommendation.docx?d=w98220445f4ca467c834cde562b977d3c&csf=1&web=1&e=WZTeUn)
  - [Accelerated Publishing System Design](https://dvagov.sharepoint.com/:w:/r/sites/CMSTeam/Shared%20Documents/%5BFinal%5D%20On%20Demand%20Publishing_%20Performance%20and%20Load%20Testing.docx?d=w8e43b417534d437d927dabc7cc50f1e3&csf=1&web=1&e=1kKjId)

**UX design description**

- N/A

**Frontend changes**

- N/A

**Backend changes**

- We are introducing a Nodejs server (aka [Nextjs](https://nextjs.org/)) that runs Nextjs for generating and serving web pages from Drupal.
- An additional logic step will be added to the RevProxy to send a request to Nextjs Server.
  **<span style="color: #00a700ff;">ON SUCCESS</span>**: Content page will be returned to the user
  **<span style="color: #d60000ff;">ON FAILURE</span>**: The RevProxy will continue its normal operation to serve the content page from the existing S3 Storage options as it does today.
- The failover logic is currently being used in production to determine if a content page is available in the Nextjs S3 Storage. If the content is not available in the Nextjs S3 Storage it will then use the Content Build S3 storage.
- More detailed information on this is available in the [Accelerated Publishing System Design](https://dvagov.sharepoint.com/:w:/r/sites/CMSTeam/Shared%20Documents/%5BFinal%5D%20On%20Demand%20Publishing_%20Performance%20and%20Load%20Testing.docx?d=w8e43b417534d437d927dabc7cc50f1e3&csf=1&web=1&e=1kKjId) Documentation.

**Does the project introduce any new connections or exchanges of new information types with other systems? (e.g. "new" meaning a new connection of type of information not already present in vets-api)**

- N/A

**Do you need to poll any APIs for status? How is API success or failure determined?**

- Monitoring will be done with Datadog and alerts will be generated if tolerances are exceeded or connection issues are detected.
- **<span style="color: #00a700ff;">Success</span>** is a 200 code returned from Drupal and a successful page build by Nextjs
- **<span style="color: #d60000ff;">Failure</span>** is code other than 200 from Drupal or if Nextjs fails to generate the page. The failover logic will then be invoked to ensure a reliable and resilient user experience
  - If a failure occurs the pages will be served from S3 Storage

**Are you handling all failure and error cases while in custody of your users's data?**

- N/A - We have **NO** User Data

**Does this update change shared code?**

- **Yes**
  - We are adding logic in the RevProxy. This logic has been and will be part of our testing.

**What information will be captured in logs or metrics?**

- N/A - User data will be captured in logs or metrics since we have no user data

**Does this project/update involve user-uploaded data?**

- N/A

**Are user-uploaded files being scanned for viruses?**

- N/A

**Does this project/update generate intermediate or "temporary" files during processing? If so, where and how are the temporary files materialized? What is the cleanup/removal process or mechanism?**

- N/A

**Internal API changes**

- There is a new connection from Nextjs to Drupal to retrieve content for generating web pages.
- The [next-drupal](https://next-drupal.org/) library provides a client for working with the [Drupal JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module) module.

**List new or modified APIs in vets-api**

- N/A

**Are you deprecating or removing any APIs?**

- No

**Do you have API documentation?**

- We have Readme documentation in our Nextjs repository to assist developers in retrieving the information needed for the content types in Drupal
- Drupal has documentation for its [JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module)
- [next-drupal](https://next-drupal.org/) has documentaion for the Drupal Client

**Describe expected call patterns**

- Requests made to our content pages on VA.gov will be routed thru the RevProxy. The RevProxy contains the logic for determing if the request will be successful from Nextjs or S3 Storage.
- We will be using caching, Kubernetes and horizontal scaling for expected spikes in traffic
- We are currently working on our performance montoring, configuration and testing

**Are there new endpoints or services that require rate limiting or throttling?**

- N/A - We have no publically exposed API endpoints.

**Are there any third party integrations, and how are they vetted?**

- N/A - Nextjs and Drupal are hosted internally. No third party integrations are used.

**Are there any new scheduled/cron jobs? If so, how are their intervals and impact considered? (especially with regard to periods of higher traffic or times when Sidekiq and infrastructure is already handling a high volume of jobs?)**

- {TIM NEEDS TO COMMENT}

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

- There are 2 systems: Nextjs and Drupal
- Currently testing performance and capacity for memory, cpu, and network
- Currently making adjustments based on our first results of chaos testing.
- Implementing improved caching and increasing horizontal scaling

**Does this project/update expect to persist information? What is the expiration policy for data added to the system? What is the cleanup/removal process or mechanism?**

- No

**Libraries and dependencies
List new or updated dependencies**

- None

**Metrics, logging, observability, alerting
Identify key areas to monitor**

- Nextjs Server - Deployed on EKS Cluster
- Drupal Server - Deployed to EC2 Intance

**Are you introducing any custom metric tags?**

- No

**Have you considered their cost and potential cardinality? High cardinality = higher cost**

- N/A

**Are there any sensitive data risks with logging?**

- No

**Infrastructure and network changes
List any changes or additions**

- **Nextjs Server** in an EKS Cluster. Currently deployed to all environments(Dev, Stage, Prod-Mirror (Not accessible by public currently))
- **Drupal Server** currently being used in Production for Internal Content Authors. Deployed to EC2 Instance

**Test strategy**
**Describe automated, manual and user acceptance test strategy**

- CI/CD Automated tests for frontend functionality using jest and playwright

* Manual User Testing using Tugboat Preview Environments
* Full build of all content pages for regression and integration testing prior to production deployment.

**Describe required test data and test user accounts**

- No test Accounts required
- Drupal data is all that is required

**Rollout plan**

- Scope:
  For the rollout, we will begin with a pilot launch, where the team will launch a small subset of pages published through Drupal to confirm that On Demand Publishing is working as expected, while minimizing any impact to Veterans if there are any problems. The scope of the pilot will be VA Tampa system’s Story and Story Listing Pages (Stories | VA Tampa health care | Veterans Affairs) because these pages have low engagement (22,698 views / 0.2% of total VAMC page views), do not contain critical information to veterans, but the content on these pages are regularly updated, so we can validate that on demand is working as expected.

- Teams to Coordinate with:
  The CMS team will be coordinating with both platform support and watchtower, as teams to alert CMS if there are any issues during the pilot.

- Rollback Plan:
  This deployment will be dependent on the update of routing logic to the RevProxy. In an event where we need to rollback the change, we will need to revert the code change in the RevProxy. This has already been successfully tested in the Dev Environment during Chaos Testing.

**Internal administration tasks**

- Maintenance and Tasks
  - Nextjs server javascript libraries to apply updates as needed
  - Drupal server code updates, including php library updates.
  - Both of these maintenance tasks are already being performed on a regular basis.
  - Currently dependabot assists us in applying appropriate updates and our support rotation reviews and updates the code.
  - Updates are performed within Github and go thru automated regression testing using our CI/CD pipeline
