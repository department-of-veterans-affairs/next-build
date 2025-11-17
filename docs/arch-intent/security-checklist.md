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

- Do not have a detailed plan for each phase yet
- [Jeff add testing and talk to Grace about plans?]

**Are there any new application endpoints, front- or back-end? If so, please give examples of how any of the endpoints could be abused by unauthorized parties, as well as a plan to mitigate such threats.**

- The system uses an [Drupal JSON:API](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module) endpoint to Get content data for requested pages
  - This is a Get only request
  - All other request types are denied by the Drupal server for this configuration
  - This endpoint is not public and only used internally by the Nextjs Server
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

[Architecture Diagram PDF](./AcceleratedPublishing_ArchDiagram.pdf)

![Accelerated Publishing Architecture Diagram](./AcceleratedPublishing_ArchDiagram.png)

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
  - The data is updated by internal VA staff. Read-Write. The users are authenticated via Entra ID and is available thru the Drupal UI

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
- [Drupal Infrastructure/Devops](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests/tree/main/apps/cms)
