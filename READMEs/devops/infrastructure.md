# Web Infrastructure

Let's examine how next-build fits into the [VA Platform Infrastructure Diagrams](<https://vfs.atlassian.net/wiki/spaces/OT/pages/2231304195/Platform+Infrastructure+Diagrams#Cloud-Architecture-(AWS)>)

For the purposes of serving VA.gov html, next build is primarily concerned with two pieces of those BRD/EKS Cloud Architecture Diagrams, the upper right corner showing the Reverse Proxy Instances and the website arrow to the S3 Bucket.

![portion of cloud architecture relevant to next-build](../images/web-infra.png)

For this stage of next-build when it coexists with content-build (i.e. both systems are publishing content to va.gov), there is a rule added to the revproxy layer that further directs traffic between two S3 buckets.

![updated diagram with fallback mechanism between buckets](../images/web-infra-updated.png)

Essentially, we check the next-content bucket first. If a file is found, serve it. The original content bucket is never requested. If the response to the next-content bucket returns a 404, the revproxy forwards the request back to the original content bucket and serves that response, whatever it is.

See the [revproxy readme](/READMEs/devops/revproxy.md) for more details.

## Content Buckets

There are a few S3 Buckets in play that next-build cares about.

- [next-content.www.va.gov](http://next-content.www.va.gov.s3-website-us-gov-west-1.amazonaws.com)
- [next-content.staging.va.gov](http://next-content.staging.va.gov.s3-website-us-gov-west-1.amazonaws.com)
- [next-content.dev.va.gov](http://next-content.dev.va.gov.s3-website-us-gov-west-1.amazonaws.com)
- [next-content.sandbox.va.gov](http://next-content.sandbox.va.gov.s3-website-us-gov-west-1.amazonaws.com)

These four buckets are identical to the 4 content buckets for content-build, and map to environments in the same way.
The www bucket serves content for the live va.gov.

An additional bucket is used for storing compressed archives of VA.gov

- [vetsgov-website-builds-s3-upload](https://console.amazonaws-us-gov.com/s3/buckets/vetsgov-website-builds-s3-upload?region=us-gov-west-1&tab=objects). Next-build archives can be found in the `next-build` folder in this bucket. The bucket itself is also used for build archives from content-build.

While next-build does not push files to the vets-website S3 buckets, it does reference them for gathering additional assets. Those buckets are:

- [vagovprod](https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com)
- [vagovstaging](https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com)
- [vagovdev](https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com)

# Preview Server Infrastructure

Next-build also operates as a dynamic preview server for editors of the CMS. Those environments are currently deployed using the BRD infrastructure, but our servers do not need to be. A Preview Server is hosted using EKS & ArgoCD for each BRD environment. These CMS Preview servers communicate with their respective BRD environments so that configuration updates can be tested appropriately.

See the [EKS](eks.md) and [Preview](../preview.md) READMEs for more information.

# Tugboat Infrastructure

For Tugboat QA environments, the architecture for next-build is slightly different.

A mirror of production exists on Tugboat here: [content-build-branch-builds](https://main-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/)

This mirror is treated as the default CMS endpoint for all next-build tugboat environments. It is also the default endpoint in `.env.example`.

If a tugboat environment is failing because the call to `flags_list` is broken, check that tugboat mirror first. It may need to be rebuilt. Once it is confirmed running smoothly, restart next-build's main base preview server as well if it needs it.

See the [CMS Devops Tugboat README](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/devops/tugboat.md) for more information.

# GitHub Infrastructure

## Github runners

Currenly, we use self-host runners. We require access to the VA network in order to build next. This is due to the fact that we need to get assets from vets-api, and other applications. The runners are setup in an autoscaling group called `dsva-vagov-next-build-gha-runners-asg`. Images for this autoscaling group is manages in the [devops](https://github.com/department-of-veterans-affairs/devops) repo.

## Github actions

Currently,

In general, our deploy will follow the below deployment diagram.

![Genearal deployment path](images/deployment.png)

Lets also dive into more specifics of our jobs.

![updated diagram with fallback mechanism between buckets](images/next-build-actions.png)

1. A11ly Tests: [These tests are covered here](../testing.md). The This is run every morning to check a handfull of pages and check if they meet accessibility guidelines.
2. Broken link check: This is custom code that emuliates code that was in content build. Because accessability and accountability are key, we need to verify that no hyperlinks go to a 404 when possible. We check every night around 7 UTC. [Its documentation can be found here](../../.github/workflows/broken-links-check.yml)
3. CMS Preview check: [see](../preview.md)
4. CodeQL: On any PR or merge to main, codeQl will check for vunerabilities.
5. Content Release: The content release name comes from the old system. For next, it does exactly what it says, it releases content. It is parameterized to include the dev, staging, and prod environments. Note however that theses named environment are not intended to be used for GITOPS as they might imply. For the sake of argument, the VA only recognises pull requests envionments and prod. Dev and staging are used prod mirrors. They can be used for testing more complex issues. But, to document as it exists today as told to me, Staging is used as a kind of "Consumer Acceptance Test" environment. Dev is used to test code but is still intended to be a prod mirror.
6. CI : Ci is run on a merge and when you open a PR. It checks code styles, dependancies, and tests to make sure there are no code or style errors.
7. Mirror images: This workflow builds the nextjs persistant server docker image.
8. Dependabot Updates: Dependabot automatically creates PR's for outdataded depenedencies. [More info found here](https://docs.github.com/en/code-security/dependabot)
9. Nightly Archive: Evevery night, build and uplad main to vetsgov-website-builds in order to have a rollback version at the ready.
10. Playwright test: PR and merge to main. Verify that unit tests still run on new code. ![More info here](/READMEs/testing.md)
11. Recurring release: Runs on a cron 8am-8pm monday-friday. Calls Content Release for all named environments. Note: we may want to change this functionality at some point. This tends to hide calls and builds
12. Release on push: This is no longer needed
13. Update infrastructure manifests: This runs after mirror image. Once a new docker image is built, we need to update its version number in the helm chart so that argo can re-deploy the image.

![The jobs are called as such:](/READMEs/devops/images/next_github_flow.png)

It is worth noting that the intention of the GitHub workflows to be fully automated. When we took over the repo, we modified the content-release workflow. Our updates include changes to allow it to publish to any "environment". As noted above we don't really have gitops. IE we do not push changes to dev, then stating, then prod. We just have preview environments that use tugboat for PR changes and a production environment. We do, however, still need to publish to dev and test enviromnets as per the VA requirements.

Also at the time, we belived the content-release workflow was the main entry to the system and as a result modified it to be able to be called on demand from another cron job utilizing github reusable workflows. We now believe that because the runs of content-release are re-used some of the results are hidden. We may want to change this functionality so that: 1: we maintain our practice of running ci, codeql, and preview before we run content-release and 2: that we setup runs with a matrix so that we can more clearly see results in github.

### Manual deployments

We have added functionality to be able to run deployments manually. This is done in the content-release workflow. To run a build:

1. Go to nextbuild repo
2. Go to actions
3. Go to content release
4. Click run workflow
5. Select branch that you want to deploy to
6. Select the environment you wan to deploy to
7. Click run workflow

This is intened to be used only for testing purposes, or hotfixes as needed.

## Monitoring

We do all of our monitoring through datadog as it is VA's chosen tool. We have a few different places that we collect metrics and do platform monitoring.

### GitHub Actions Monitoring

Currently, the folloing actions have monitoring events that we send to datadog: content-release and a11y.

1. Content-release: Content release tracks crutial metrics to datadog to make sure we can debug our deployment times and keep our SLA limits in check. We track:
   a. The project title
   b. The project repo
   c. The workflow
   d. How long it takes to setup the tools to build the service
   e. How long it takes to build next
   f. How long it takes for the github job to run
   G. Build status

2. A11y: Tracks our accessibility. We log:
   a. How many pages have errors ( if any)

### Devops monitoring

We also have monitoring setup in the devops repo. This repo has terraform code that defines alarms and alerts for our application. Most of the monitors and alerts are setup [here](https://github.com/department-of-veterans-affairs/devops/blob/master/terraform/environments/datadog/cms.tf)

Most notibly for our SLA requirements, [we have a consecutive failurs alarm](https://github.com/department-of-veterans-affairs/devops/blob/7ba9bc3758b6fe4835e6e05d040e001405400418/terraform/environments/datadog/cms.tf#L897).

### Reverse proxy

For our production environment, currently, we serve our static files through AWS S3. Since we are only part of the entire va.gov site we use a reverse proxy to durect traffic to the correct location.

The reverse proxy has its own repo found [here.](https://github.com/department-of-veterans-affairs/vsp-platform-revproxy).

This is a repo that is owned by the platform team. It supports all va.gov. Our interaction with it is to make sure that it routes back to next buckets and/or parsestant server correctly. Most of this is done through the `nginx_website_server.config.j2`. Notibly we inject content in the / location of the [config.](https://github.com/department-of-veterans-affairs/vsp-platform-revproxy/blob/226d31063f267236607e1980bc0655311a821fc3/template-rendering/revproxy-vagov/templates/nginx_website_server.conf.j2#L378)

Here we check if the variable for next is set in any of the files foind in [the vars folder](https://github.com/department-of-veterans-affairs/vsp-platform-revproxy/tree/main/template-rendering/revproxy-vagov/vars)

NGINX has different vars for different environmnets. It is worth noting that this repo does seem to use gitops. IE: Platform team expects that changes will be tested in dev, then staging, and finally in prod. For example for rev-proxy dev you would go to the line that mentions next_content_proxy_url and fill in the correct value. [Currently it directs it to our s3 bucket hosting the content.](https://github.com/department-of-veterans-affairs/vsp-platform-revproxy/blob/226d31063f267236607e1980bc0655311a821fc3/template-rendering/revproxy-vagov/vars/nginx_config_vagov-dev.yml#L19C3-L19C25)

In later versions, we intend to point this url to the persistant server running in EKS.
