Deploy Process

Environment updates run through the following steps using GitHub Actions and ArgoCD:

1. Run "Create Production Tag" workflow (.github/workflows/production-tag.yml)
  - https://github.com/department-of-veterans-affairs/next-build/actions/workflows/production-tag.yml
2. Tag creation triggers "Create and Commit Next-Build Docker Image" workflow (.github/workflows/mirror-images.yml)
  - The next-build container is built from docker/Dockerfile and is designed for use within this workflow. There are dependencies on vets-website during the app build, so in the first stage it sets up both next-build and vets-website next to one another so that the necessary assets can be found. The second stage only preserves the next-build app, however, and discards vets-website as it is no longer needed.
  - Docker image uploaded to Amazon Elastic Container Registry dsva/next-build-node (https://us-gov-west-1.console.amazonaws-us-gov.com/ecr/repositories/dsva/next-build-node?region=us-gov-west-1)
3. Successful image creation triggers "Update infrastructure manifest" workflow (.github/workflows/update-manifest.yml)
  - This step updates the Docker image tags for the next-build-test and next-build apps, for each env, in the vsp-infra-application-manifests repo (https://github.com/department-of-veterans-affairs/vsp-infra-application-manifests)
4. ArgoCD detects change to the Docker image tag in each app env within the vsp-infra-application-manifests repo
  - apps/next-build-test/staging/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-test-staging
  - apps/next-build-test/prod/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-test-prod
  - apps/next-build/staging/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-staging
  - apps/next-build/prod/values.yaml --> https://argocd.vfs.va.gov/applications/next-build-prod
5. ArgoCD replaces Docker image in EKS
  - https://us-gov-west-1.console.amazonaws-us-gov.com/eks/home?region=us-gov-west-1#/clusters/dsva-vagov-staging-cluster
  - https://us-gov-west-1.console.amazonaws-us-gov.com/eks/home?region=us-gov-west-1#/clusters/dsva-vagov-prod-cluster
