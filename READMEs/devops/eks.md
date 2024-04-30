# EKS

## Deploy Process

Environment updates run through the following steps using GitHub Actions and ArgoCD:

1. Passing CI workflow in main branch triggers ["Create Production Tag" workflow](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/production-tag.yml)

2. Tag creation triggers ["Create and Commit Next-Build Docker Image" workflow](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/mirror-images.yml)

   - Docker image uploaded to Amazon Elastic Container Registry [dsva/next-build-node](https://us-gov-west-1.console.amazonaws-us-gov.com/ecr/repositories/dsva/next-build-node?region=us-gov-west-1).

3. Successful image creation triggers ["Update infrastructure manifest" workflow](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/update-manifest.yml)

   - This step updates the Docker image tags for the next-build-test and next-build apps, for each env, in the [vsp-infra-application-manifests repo](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests).

4. ArgoCD detects change to the Docker image tag in each app env within the vsp-infra-application-manifests repo

   - apps/next-build-test/staging/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-test-staging
   - apps/next-build-test/prod/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-test-prod
   - apps/next-build/staging/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-staging
   - apps/next-build/prod/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-prod

5. ArgoCD replaces Docker image in EKS

   - https://us-gov-west-1.console.amazonaws-us-gov.com/eks/home?region=us-gov-west-1#/clusters/dsva-vagov-staging-cluster
   - https://us-gov-west-1.console.amazonaws-us-gov.com/eks/home?region=us-gov-west-1#/clusters/dsva-vagov-prod-cluster

## Build Details

The next-build container is built from docker/Dockerfile which is designed for use within the workflow detailed above. There are dependencies on vets-website during the app build, so it sets up both next-build and vets-website next to one another so that the necessary assets can be found. The second stage in the Dockerfile only preserves the next-build app, however, and discards vets-website as it is no longer needed. The Dockerfile needs to run from a context like this:

```
/(Context Directory)
   .dockerignore
   Dockerfile
   /next-build
      (next-build repo clone)
   /vets-website
      (vets-website repo clone)
```

You can see this arrangement set up in .github/workflows/mirror-images.yml, where it clones the two repos and copies Dockerfile and .dockerignore to the root directory of both before building.

## Helm Charts and Kubernetes Environment

The application Helm charts within the [vsp-infra-application-manifests repo](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests) use an init container to set up the appropriate env file for a given deploy.

The charts under `apps/next-build-test` are for testing and define `staging` and `prod` environment configs in their respective subdirectories.

The charts under `apps/next-build` are for production use and also define `staging` and `prod` under their respective subdirectories. Note that there is a `dev` subdirectory, but it is currently not used.

Refer to each `values.yaml` (eg. [next-build-test/staging/values.yaml](https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests/blob/main/apps/next-build-test/staging/values.yaml)) file for the specific environmental differences. In general this will be the configmap values used by the node.js app's env file, the Datadog environment, and the Docker container image.

Even though there is one set of app deploys designated as "test", there are currently no specific processes or automation around acceptance testing or other gatekeeping for production deploys. They could be considered a safe playground for evaluating changes or expanded in the future for more rigorous QA processes. As described above, the ArgoCD deploy pushes changes everywhere if the main branch passes CI.

Secrets, such as DRUPAL_CLIENT_ID and DRUPAL_CLIENT_SECRET, are stored as external secrets (see `secrets.yaml`).

These secret (and non-secret) values are pulled in from values.yaml and configmap.yaml. The init container uses `data` from `configmap.yaml` to populate the env config file, which is used by the next-build app. This is mounted from a /secrets volume, visible as /app/envs from next-build (see `next-build-deployment.yaml`)
