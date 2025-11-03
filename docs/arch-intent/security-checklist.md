Questions to be Answered
The following product or feature descriptions may be answered with a reference link to the team’s documentation. However, the provided links must be specific to the request.

Please describe what problem this product or feature solves.
Please describe a plan to monitor this code base after deployment, including the following scenarios (NOTE: If you don't (yet) have such a plan, or don't know how to get started with one, we can work on this with you!).
The code base is compromised at source- or run-time.
How does the code base get disabled in the product?
How would you detect a compromise?
What process and privilege does the code base execute under?
If so, is that process isolated?
If so, what additional credentials are available to that process?
The code base is infiltrated or ex-filtrated.
Links to dashboards that help identify and debug application issues
Provide your Release Plan with the "Planning" sections completed (in each section: Phase I, Phase II, Go Live)
Are there any new application endpoints, front- or back-end? If so, please give examples of how any of the endpoints could be abused by unauthorized parties, as well as a plan to mitigate such threats.
Is there any new logging data being captured? If so, what data is being captured, how, and where is it stored?
Is Personal Health Information/PHI, Personal Identifiable Information/PII, or any other Personal Information/PI being captured? If so, please answer the following questions:
Is the PHI strongly encrypted?
Is the PII encrypted?
Can the sensitive information be scrubbed?
Are there any new, modified, or existing Cookies being used?
If so, are there any new Cookies?
If so, why can’t the existing Cookies be used?
If so, are there any modified Cookies?
If so, how are the Cookies modified?
If so, are there any existing Cookies?
Is this feature authenticated or unauthenticated?
Are there any other specific subjects that you want to highlight or focus additional attention on?
Artifacts
Please provide the following documentation as attachments.

Architecture Diagram: This diagram must go beyond simple boxes and lines. It must clearly indicate which portions of the architecture are within the scope of the review, which portions are dependencies within the product, and which portions are external dependencies. This diagram must also illustrate the following specifics.
Which implementation of security approaches were considered along with the approach that was chosen and why?
If there are any libraries or components that this code base will depend upon that are currently not yet part of the code base? How and why were these selected?
Incident Response Plan, including Points of Contact for your system and dependent VA back-ends.
If a security vulnerability is discovered or reported in this code base, what is the plan and timeline for rolling out the fix?
Sequence Diagram: This diagram must include any authentication steps if this is an authenticated experience.
Data Flow Diagram: This diagram must illustrate the following specifics.
What data is collected or used, and where, including information such as credentials used by this system?
Where is the data is stored and how, including information such as any encryption used?
How is the data transferred, including information such as any encryption used?
Who accesses the data and in what capacity (read or read-write)?
What is the audit trail of data access and manipulation?
API Endpoint Documentation: This may include a link to a Swagger/OpenAPI document. Any new API endpoints introduced by this product or feature must be explicitly identified.
Product Specifics:
A link to the Release Plan with the "Planning" sections completed (in each section: Phase I, Phase II, Go Live)
A link to the Product Outline
Ensure Product Outline contains Incident Response info, including:
Points of contact for your system and dependent VA back-ends
Links to dashboards that help identify and debug application issues
Is there a playbook included in your product outline, for investigating and handling likely failure modes? If so, link to your Product Playbook
Code links: Link to relevant code directories in GitHub.
Front-end code links
Back-end code links
DevOps code links
