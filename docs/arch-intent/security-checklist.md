**Please describe what problem this product or feature solves.**

- The second step to the Accelerated Publishing work will be to implement a persistent server that will allow content to be published from Drupal CMS to VA.gov much more quickly; we are estimating ~5 minutes from when content is updated in Drupal CMS to updated in VA.gov. This is because the server will be triggered to rebuild the pages after a predetermined amount of time.

**Please describe a plan to monitor this code base after deployment, including the following scenarios (NOTE: If you don't (yet) have such a plan, or don't know how to get started with one, we can work on this with you!).**

- We are using DataDog for monitoring

**The code base is compromised at source- or run-time.**

- No plan in place. Need feedback on how to implement a solution.

**How does the code base get disabled in the product?**

**How would you detect a compromise?**

**What process and privilege does the code base execute under?**

- **If so, is that process isolated?**

- **If so, what additional credentials are available to that process?**

**The code base is infiltrated or ex-filtrated.**
**Links to dashboards that help identify and debug application issues**

**Provide your Release Plan with the "Planning" sections completed (in each section: Phase I, Phase II, Go Live)**

**Are there any new application endpoints, front- or back-end? If so, please give examples of how any of the endpoints could be abused by unauthorized parties, as well as a plan to mitigate such threats.**

**Is there any new logging data being captured? If so, what data is being captured, how, and where is it stored?**

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

  - unauthenticated

- **Are there any other specific subjects that you want to highlight or focus additional attention on?**

**Artifacts**
Please provide the following documentation as attachments.

**Architecture Diagram:** This diagram must go beyond simple boxes and lines. It must clearly indicate which portions of the architecture are within the scope of the review, which portions are dependencies within the product, and which portions are external dependencies. This diagram must also illustrate the following specifics.

- **Which implementation of security approaches were considered along with the approach that was chosen and why?**

- **If there are any libraries or components that this code base will depend upon that are currently not yet part of the code base? How and why were these selected?**

**Incident Response Plan, including Points of Contact for your system and dependent VA back-ends.**

- **If a security vulnerability is discovered or reported in this code base, what is the plan and timeline for rolling out the fix?**
  - A new branch is created in the appropriate repo - ~1 min
  - Fixed is applied, tested and branch is pushed to our repo and a PR is created - ~5 mins
  - PR is reviewed and automated tests are run - ~10 mins
  - PR is merged after successful review and automated testing
  - Deployment executes and updates the production environment
    - Nextjs Env - ~10 mins
    - Drupal Env - ~15 mins
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

**A link to the Product Outline
Ensure Product Outline contains Incident Response info, including:
Points of contact for your system and dependent VA back-ends
Links to dashboards that help identify and debug application issues
Is there a playbook included in your product outline, for investigating and handling likely failure modes? If so, link to your Product Playbook**

**Code links:** Link to relevant code directories in GitHub.

- [Nextjs Repo](https://github.com/department-of-veterans-affairs/next-build)
- [Drupal Repo](https://github.com/department-of-veterans-affairs/va.gov-cms)
- [Nextjs Infrastructure/Devops](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests/tree/main/apps/next-build)
- [Druapl Infrastructure/Devops](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests/tree/main/apps/cms)
