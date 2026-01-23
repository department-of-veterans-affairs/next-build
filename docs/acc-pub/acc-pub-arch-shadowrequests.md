# Introduction for Accelerated Publishing - Shadow Request Archtecture

## Overview

The approach for this architecture uses the built in shared caching feature of nextjs, the shadow request from NGINX and AWS S3 storage. The idea is to serve ISR pages directly from S3 using nginx as our web server.

## How ISR pages get created/stored

When a request hits the nextjs server the shared caching script executes. The script `is sent the fuill json object that normally would get stored in Nextjs cache that would then be served later by Nextjs. In our shared cahce script we break apart the JSON object into 3 parts:

1. Static HTML
2. Metadata
3. Page data

These 3 objects get stored in the S3 bucket in the appropriate folder to be then served by the NGINX web server.

The code uses a metadat.kind property to match "PAGES" or "PAGE" to determine if the object is a page, If it is page then it will process the object to store in S3. This is a key parameter and should be reviewed if anything breaks.

## Static Assets

Static assets must be stored using a seperate process since the shared caching only is for creating and storing the page html and data. There are 2 parts:

1. Public assets stored in the "public" directory
2. Chunks created during the ISR build process, stored in the ".next" folder

The assets a page needs can easily be determined by loading the page with the web server and viewing the paths to assets with a 404.

These assets should be kept up to date with each code deploy/CI/CD build process.

The build proces can be exectued by using "yarn build". DO NOT USE yarn build -export. The export is for a different static generation. We need to use the ISR build process without the export flag.

## Testing

### Locust Testing

I have setup an EC2 instance in the staging environment that can connect to the nextjs staging cluster and is publically accessible. You can access the locust UI at:

- nextjs-locust-cms-test

- http://ec2-3-31-42-137.us-gov-west-1.compute.amazonaws.com:8089/

This runs in a docker container on the EC2 instance. The code/docker contianer is in the locust direcrtory

Locally you can also run locust using the code in:

- ./devops-testing/load-testing

Both scripts are similar and load urls from a sitemap in the ./sitemaps directory

#### Command for locust

##### Starting Locust container

docker compose up --scale worker=10 -d

- You can specify as many workers as you need for load testing

##### Testing connection from Locust EC2 to a preview revproxy server

From the EC2 instance cli you can run a curl command to test the connection. Specify the host as staging.va.gov to avoid getting a 301 'has moved' error
curl -k -v -H "Host: staging.va.gov" https://ip-10-247-34-244.us-gov-west-1.compute.internal/tampa-health-care/stories/clinical-resource-hub-increases-veterans-access-to-care/

#### Quick Start

1. Go to the Locust UI at http://ec2-3-31-42-137.us-gov-west-1.compute.amazonaws.com:8089/
2. Select the NextBuildUser user class to test next build urls

- This line of code tells you what sitemap will be used for that user class
  `NEXTBUILD_URLS = filter_by_source(URLS, 'sitemap-nb.xml')`

3. Then set the host url for the environment you are testing.

- Preview revproxy for example:
  https://ip-10-247-97-70.us-gov-west-1.compute.internal
- Staging
  http://staging.va.gov

## Next Steps:

1. Set the correct permissions on S3

- Nextjs servers should be associated with Service Accounts and the Service Accounts should be added to the S3 Storage Permissions/Bucket Policies

2. Setup new code block for the nextjs S3 bucket and shadow request code

- There should be 3 code blocks we own, content, nextcontent and the new nextshadowrequests3content. The new block should use the code from this branch:
  https://github.com/department-of-veterans-affairs/vsp-platform-revproxy/tree/testing-nextjs-accpub
- That branch has teh code in the nextcontent block and this should be moved to a new code block and the old nextcontent should be left intact as a backup.

3. Create the CI/CD piepline process to keep the static assets up to date

- Will need to copy the public static assets and the build chunks to the S3 bucket.
- Should utilize the GIT_HASH for the Build ID in nextjs, this will allow you to delete the old chunks and static assets that are no longer needed.
  - .next/static/chunks
  - /public

4. Setup proper monitoring/incident response in DataDog

## AWS Helpful Commands

From your local environment:

1. Login to AWS

- aws-mfa --device arn:aws-us-gov:iam::[aws-account-id]:mfa/[aws-username]

2. AWS SSM Session

- sudo aws --region us-gov-west-1 ssm start-session \
  --target [preview-ec2-instance-id]\
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["443"], "localPortNumber":["443"]}' --debug

3. View RevProxy Logs

- Connect to EC2 instance using AWS Console
- from the CLI
  - sudo docker logs -f revproxy

4. Setup revproxy tunnel using the Preview tag in github
   https://vfs.atlassian.net/wiki/spaces/PCMS/pages/3980656704/Setting+up+a+reverse+proxy+tunnel+for+local+testing?force_transition=4f2ed33e-d08f-46bc-9fe1-a8fbcb74cdba
