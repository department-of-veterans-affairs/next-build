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

---

Security Checklist

**Please describe what problem this product or feature solves.**

- The second step to the Accelerated Publishing work will be to implement a persistent server that will allow content to be published from Drupal CMS to VA.gov much more quickly; we are estimating ~5 minutes from when content is updated in Drupal CMS to updated in VA.gov. This is because the server will be triggered to rebuild the pages after a predetermined amount of time.

**Please describe a plan to monitor this code base after deployment, including the following scenarios (NOTE: If you don't (yet) have such a plan, or don't know how to get started with one, we can work on this with you!).**

- We are using DataDog for monitoring
- Using lock files for our code in Nextjs
- No plan in place to monitor for unauthorized code changes in production servers
- We welcome insight and direction from platform on a possible solution if this is a threat we should consider.

* **The code base is compromised at source- or run-time.**
  - At source we use GitHub and monitor all changes and have security on who can merge to main
  - Using lock files
* **How does the code base get disabled in the product?**
  - N/A
* **How would you detect a compromise?**
  - We have continuous integration tests
  - Using lock files

- **What process and privilege does the code base execute under?**

  - There is no specified role defined for Nextjs or Drupal

  * **If so, is that process isolated?**

  * **If so, what additional credentials are available to that process?**

* **The code base is infiltrated or ex-filtrated.**
  - Need guidance from Platform

- **Links to dashboards that help identify and debug application issues**
  - [CMS Production and Staging [Drupal]](https://vagov.ddog-gov.com/dashboard/vnk-g4s-fru/cms-prod-staging?fromUser=false&offset=1&refresh_mode=daily&from_ts=1762318800000&to_ts=1762405199999&live=true)
  - [CMS APM [Drupal]](https://vagov.ddog-gov.com/apm/entity/service%3Avagov-cms?dependencyMap.showNetworkMetrics=false&env=brd-prod&fromUser=false&graphType=flamegraph&groupMapByOperation=null&primaryTags=%3A%2A&shouldShowLegend=true&spanKind=server&traceQuery=&start=1762438001585&end=1762441601585&paused=false)
  - [Nextjs K8s Pods Overview](https://vagov.ddog-gov.com/dashboard/6db-3rm-wui/kubernetes-pods-overview-nextjs-test-staging?fromUser=false&refresh_mode=sliding&tpl_var_cluster%5B0%5D=dsva-vagov-prod-cluster&tpl_var_namespace%5B0%5D=next-build&from_ts=1761836663179&to_ts=1762441463179&live=true)
  - [Nextjs RUM](https://vagov.ddog-gov.com/dashboard/f9n-yzk-t5u/rum---web-app-performance-nextjs?fromUser=false&refresh_mode=sliding&tpl_var_applicationName%5B0%5D=%22Nextjs%20Frontend%22&tpl_var_env%5B0%5D=vagovprod&from_ts=1761836738454&to_ts=1762441538454&live=true)
  - [Nextjs APM](https://vagov.ddog-gov.com/apm/entity/service%3Avagov-next-build?dependencyMap.showNetworkMetrics=false&env=eks-prod&fromUser=false&graphType=flamegraph&groupMapByOperation=null&operationName=web.request&shouldShowLegend=true&traceQuery=&start=1762438001585&end=1762441601585&paused=false)

**Provide your Release Plan with the "Planning" sections completed (in each section: Phase I, Phase II, Go Live)**

- Do not have a detailed planned for each phase yet
- [Jeff add testing and talk to Grace about plans?]

**Are there any new application endpoints, front- or back-end? If so, please give examples of how any of the endpoints could be abused by unauthorized parties, as well as a plan to mitigate such threats.**

- The system uses an [Drupal JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module) endpoint to Get content data for requested pages
  - This is a Get only request
  - All other request types are denied by the Drupal server for this configuration
  - This endpoitn is not public and only used internally by the Nextjs Server
- Potential for DDOS attack
  - We will be limiting connections and imposing time limits on responses to prevent overloading the system.
  - Question for Platform: Are there other solutions we can implement to prevent security breaches?

**Is there any new logging data being captured? If so, what data is being captured, how, and where is it stored?**

- Only traffic/application monitoring information stored in Datadog
- No user data or input data from users

**Is Personal Health Information/PHI, Personal Identifiable Information/PII, or any other Personal Information/PI being captured? If so, please answer the following questions:**

- **Is the PHI strongly encrypted?**
  - N/A
- **Is the PII encrypted?**
  - N/A
- **Can the sensitive information be scrubbed?**
  - N/A
- **Are there any new, modified, or existing Cookies being used?**

  - No
  - **If so, are there any new Cookies?**
    - N/A
  - **If so, why can’t the existing Cookies be used?**
    - N/A
  - **If so, are there any modified Cookies?**
    - N/A
  - **If so, how are the Cookies modified?**
    - N/A
  - **If so, are there any existing Cookies?**
    - N/A

- **Is this feature authenticated or unauthenticated?**

  - Unauthenticated

- **Are there any other specific subjects that you want to highlight or focus additional attention on?**
  - No

**Artifacts**
Please provide the following documentation as attachments.

**Architecture Diagram:**

![Accelerated Publishing Architecture Diagram](./diagrams/AcceleratedPublising_ArchDiagram.png)

- **Which implementation of security approaches were considered along with the approach that was chosen and why?**

| Feature/Service/Configurations                    | Mitigated Cyber Attacks                                                                        | Notes                                                                                              |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Firewall (WAF)                                    | Injection Attacks                                                                              | Need to confirm if this is handled by TIC or other current infrastructure deployed with Kubernetes |
| Content Security Policy (CSP)                     | Cross-Site Scripting (XSS) Client-Side Attacks                                                 |                                                                                                    |
| Principle of Least Privilege                      | Security Misconfigurations, Broken Access Control, API Security Vulnerabilities                | Only using Get Requests from Nextjs to Drupal                                                      |
| Disallow requests to private IP ranges            | Server-Side Request Forgery (SSRF)                                                             |                                                                                                    |
| Rate limit for API and controller access          | Broken Access Control, API Security Vulnerabilities, Denial of Service (DoS) & Distributed DoS |                                                                                                    |
| Using lock files to prevent floating dependencies | Supply Chain Attacks                                                                           |                                                                                                    |
| Regularly audit dependencies                      | Supply Chain Attacks                                                                           | Using Dependabot                                                                                   |
| HTTPS for all connections                         | Data Tampering / Injection                                                                     |                                                                                                    |

- **Platform Question**: Guidance on if we need to schedule our own Penetration testing (pen testing)?

* **If there are any libraries or components that this code base will depend upon that are currently not yet part of the code base? How and why were these selected?**

**Incident Response Plan, including Points of Contact for your system and dependent VA back-ends.**

- **If a security vulnerability is discovered or reported in this code base, what is the plan and timeline for rolling out the fix?**
  - A new branch is created in the appropriate repo - ~1 min
  - Fixed is applied, tested and branch is pushed to our repo and a PR is created - ~5 mins
  - PR is reviewed and automated tests are run - ~10 mins
  - PR is merged after successful review and automated testing
  - Deployment executes and updates the production environment
    - Nextjs Env - ~10 mins [Tim and Edmund to comment]
    - Drupal Env - ~15 mins [Tim and Edmund to comment]
  - No downtime due to the deployment process.

**Sequence Diagram: This diagram must include any authentication steps if this is an authenticated experience.**

- N/A

**Data Flow Diagram: This diagram must illustrate the following specifics.**

- **What data is collected or used, and where, including information such as credentials used by this system?**

  - No data is collected from the public. Only data that is collected is the public facing content created by VA staff via authenticated experience using EntraID

- **Where is the data is stored and how, including information such as any encryption used?**

  - The data is stored in Drupal using MariaDB.

- **How is the data transferred, including information such as any encryption used?**

  - Content is accessed via https

- **Who accesses the data and in what capacity (read or read-write)?**

  - The data is public content and is accessible via the va.gov website. Read-Only
  - The data is updated by internal VA staff. Read-Write. The users are authenticated via Entra ID and is availbale thru the Drupal UI

- **What is the audit trail of data access and manipulation?**
  - yes, Drupal provides an audit trail of all content changes/additions

**API Endpoint Documentation: This may include a link to a Swagger/OpenAPI document. Any new API endpoints introduced by this product or feature must be explicitly identified.**

- [Drupal JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module) module.

**Product Specifics:
A link to the Release Plan with the "Planning" sections completed (in each section: Phase I, Phase II, Go Live)**

**A link to the Product Outline**

- [Accelerated Publishing Product Outline](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/cms/product-outlines/on-demand-publishing/on-demand-publishing-product-outline.md)

**Links to dashboards that help identify and debug application issues**

- [CMS Production and Staging [Drupal] - Datadog Dashboard](https://vagov.ddog-gov.com/dashboard/vnk-g4s-fru/cms-prod-staging?fromUser=false&offset=1&refresh_mode=daily&from_ts=1762318800000&to_ts=1762405199999&live=true)

- [CMS APM [Drupal] - Datadog Dashboard](https://vagov.ddog-gov.com/apm/entity/service%3Avagov-cms?dependencyMap.showNetworkMetrics=false&env=brd-prod&fromUser=false&graphType=flamegraph&groupMapByOperation=null&primaryTags=%3A%2A&shouldShowLegend=true&spanKind=server&traceQuery=&start=1762438001585&end=1762441601585&paused=false)

- [Nextjs Pods Overview - Datadog Dashboard](https://vagov.ddog-gov.com/dashboard/6db-3rm-wui/kubernetes-pods-overview-nextjs-test-staging?fromUser=false&refresh_mode=sliding&tpl_var_cluster%5B0%5D=dsva-vagov-prod-cluster&tpl_var_namespace%5B0%5D=next-build&from_ts=1761836663179&to_ts=1762441463179&live=true)

- [Nextjs RUM - Datadog Dashboard](https://vagov.ddog-gov.com/dashboard/f9n-yzk-t5u/rum---web-app-performance-nextjs?fromUser=false&refresh_mode=sliding&tpl_var_applicationName%5B0%5D=%22Nextjs%20Frontend%22&tpl_var_env%5B0%5D=vagovprod&from_ts=1761836738454&to_ts=1762441538454&live=true)

- [Nextjs APM - Datadog Dashboard](https://vagov.ddog-gov.com/apm/entity/service%3Avagov-next-build?dependencyMap.showNetworkMetrics=false&env=eks-prod&fromUser=false&graphType=flamegraph&groupMapByOperation=null&operationName=web.request&shouldShowLegend=true&traceQuery=&start=1762438001585&end=1762441601585&paused=false)

**Is there a playbook included in your product outline, for investigating and handling likely failure modes?**

- No playbook but several ReadMe files in each repo to address typical troubleshooting

**Code links:** Link to relevant code directories in GitHub.

- [Nextjs Repo](https://github.com/department-of-veterans-affairs/next-build)
- [Drupal Repo](https://github.com/department-of-veterans-affairs/va.gov-cms)
- [Nextjs Infrastructure/Devops](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests/tree/main/apps/next-build)
- [Druapl Infrastructure/Devops](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests/tree/main/apps/cms)
