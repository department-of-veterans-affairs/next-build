Frontend changes

- There are no Front End Changes. This is a backend server that serves front end webpages that already exist in production via S3 bucket

Backend changes
Does the project introduce any new or unusual infrastructure dependencies?

- We are introducing a Nodejs server that runs Nextjs for generating and serving web pages for Content from Drupal.
- An extra logic step will be added to the RevProxy to send a request to Nextjs Server.
  ON SUCCESS: Content page will be returned to the user
  ON FAILURE: The RevProxy will continue its normal operation to serve the content page from the existing S3 Storage options as it does today.
- The failover logic is currently being used in production to determine if a content page is available in the Nextjs S3 Storage. If it is not it fails over to our Content Build S3 storage.
- More detailed information on this is available in the Accelerated Publishing System Design Documentation.

Does the project introduce any new connections or exchanges of new information types with other systems? (e.g. "new" meaning a new connection of type of information not already present in vets-api)

- NO
  Do you need to poll any APIs for status? How is API success or failure determined?
- NO, Our failover will handle if there are any api issues and the user expereience will not be impacted. We will be monitoring and have alerts to let us know if ther is a problem.

Are you handling all failure and error cases while in custody of your users's data?

- N/A - We have NO User Data

Does this update change shared code?

- Yes, We are adding logic in the RevProxy. This logic has been and will be part of our testing.

What information will be captured in logs or metrics?

- N/A - User data will be captured in logs or metrics since we have no user data

Does this project/update involve user-uploaded data?

- N/A

Are user-uploaded files being scanned for viruses?

- N/A

Does this project/update generate intermediate or "temporary" files during processing? If so, where and how are the temporary files materialized? What is the cleanup/removal process or mechanism?

- NO

Internal API changes
List new or modified APIs in vets-api

- N/A
  Are you deprecating or removing any APIs?
- N/A

Do you have API documentation?

- N/A

Describe expected call patterns
Are there new endpoints or services that require rate limiting or throttling?

- N/A - We have no publically exposed API endpoints, however we vcan disucss how we handle spikes in traffic.

Are there any third party integrations, and how are they vetted?

- NO

Are there any new scheduled/cron jobs? If so, how are their intervals and impact considered? (especially with regard to periods of higher traffic or times when Sidekiq and infrastructure is already handling a high volume of jobs?)

- Ask Tim

Is schema validation enforced (ex: using the vets-json-schema repo)?

- On Demand Publishing will not impact any internal or external API changes.

External API changes
List new or modified APIs for upstream or external systems
Describe expected call patterns
What PII or PHI will be transmitted to/from the external systems?
On Demand Publishing will not impact any internal or external API changes.
Background jobs
List any required background processing
Describe error and dead letter handling

Data storage

- NO CHANGES

Describe new or modified databases, tables or columns

- NONE

Describe indexes and constraints

- NONE
  Identify PII and PHI and where and how it will be stored, processed, expired and deleted
- NONE

Is this change introducing a large or new volume of data?

- NO

Do these changes impact database or caching layers (ex: Redis, Postgres)?

- NO

Do the changes have implications for data volume, memory, or CPU usage to consider?

- WE have 2 systems: Nextjs and Drupal
- We have and are currently testing performance and capacity for memory, cpu, and network
- We are currently making adjustments based on our first results of chaos testing.
  Implementing improved caching and increasing horizontal scaling

Does this project/update expect to persist information? What is the expiration policy for data added to the system? What is the cleanup/removal process or mechanism?

- No

Libraries and dependencies
List new or updated dependencies

- Nextjs

Metrics, logging, observability, alerting
Identify key areas to monitor

- Nextjs Server - Deployed on EKS Cluster
- Drupal Server - Depoyed to EC2 Intance

Are you introducing any custom metric tags?
N/A - Not at present time

Have you considered their cost and potential cardinality? High cardinality = higher cost

Are there any sensitive data risks with logging?
None

Infrastructure and network changes
List any changes or additions

- Using Nextjs sever in an EKS Cluster. Currently deployed to all environments(Dev, Stage, Prod-Mirror (Not accessible in current public production))

- Drupal currently being used in Production for Internal Content Authors
  We may add additional caching capabilities based on our initial Chaos Test Results

Test strategy
Describe automated, manual and user acceptance test strategy

- Automated tests for frontend functionality
- Manual User Testing using Tugboat Preview Environments
- Full build of all content pages for regression and integration testing prior to production deployment.

Describe required test data and test user accounts

- No test Accounts required
- Drupal data is all that is required
