# Web Infrastructure

Let's examine how next-build fits into the [VA Platform Infrastructure Diagrams](<https://vfs.atlassian.net/wiki/spaces/OT/pages/2231304195/Platform+Infrastructure+Diagrams#Cloud-Architecture-(AWS)>)

For the purposes of serving VA.gov html, next build is primarily concerned with two pieces of those BRD/EKS Cloud Architecture Diagrams, the upper right corner showing the Reverse Proxy Instances and the website arrow to the S3 Bucket.

![portion of cloud architecture relevant to next-build](/READMEs/images/web-infra.png)

For this stage of next-build when it coexists with content-build (i.e. both systems are publishing content to va.gov), there is a rule added to the revproxy layer that further directs traffic between two S3 buckets.

![updated diagram with fallback mechanism between buckets](/READMEs/images/web-infra-updated.png)

Essentially, we check the next-content bucket first. If a file is found, serve it. The existing bucket is never requested. If the response to the next-content bucket returns a 404, the revproxy forwards the request back to the existing content bucket and serves that response, whatever it is.

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

See the [EKS](/READMEs/devops/eks.md) and [Preview](/READMEs/preview.md) READMEs for more information.

# Tugboat Infrastructure

For Tugboat QA environments, the architecture for next-build is slightly different.

A mirror of production exists on Tugboat here: [content-build-branch-builds](https://main-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/)

This mirror is treated as the default CMS endpoint for all next-build tugboat environments. It is also the default endpoint in `.env.example`.

If a tugboat environment is failing because the call to `flags_list` is broken, check that tugboat mirror first. It may need to be rebuilt. Once it is confirmed running smoothly, restart next-build's main base preview server as well if it needs it.

See the [CMS Devops Tugboat README](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/devops/tugboat.md) for more information.
