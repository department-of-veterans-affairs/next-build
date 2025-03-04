# Tugboat 101

## Summary of Tugboat

[Tugboat](https://docs.tugboatqa.com/) is a container-based tool for generating QA Environments. Tugboat creates "Previews" which are environments that you can test proposed code changes in, login with a web shell, and view logs in the UI. Each Preview is built from a Base Preview.

Tugboat contains **Projects**. Each Project can contain **Repositories** (not related to Github). Each Repository then has a **Base Preview**, and **Previews**.

- **Previews**, or PR Previews, are the built environments you interact with for a given set of Pull Request (PR) changes.
- **Base Preview**
  Take the term Base to mean bottom or foundation: Base Preview is a container, built from a versioned state of the repo's code, with all the vendor depencies baked in. Tugboat uses Base Previews to make PR Preview creation quick and disk storage efficient. After a 3-8min build, Base Previews are ready to layer next-build code changes on top and run page generation operations (`yarn export`) and things that depend on that (Cypress tests).

See the [va.gov-cms tugboat docs](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/tugboat.md) for more information.

## next-build's usage

At VA, our lower environments are each built from a Tugboat Base Preview, in some fashion. Our Tugboat configuration is relevant to the discussion:

1. **Project**: [next-build](https://tugboat.vfs.va.gov/64d5537c2d3036648da7c7ff)
   1. **Repository**: [next-build Pull Request Environments](https://tugboat.vfs.va.gov/64d5537c2d3036648da7c7ff) — Is used for managing PR Previews, automatically triggered by Pull Requests in next-build repo.
      1. **Base Preview**: Built nightly at 11am UTC (6am EST, 5am EDT). It is built one hour later than the CMS Mirror Base Preview's nightly refresh because it is the default target endpoint for data. This data will then be used for all next-build PR Preview envs until the next time this Base Preview is refreshed.

## CLI Setup

Hopefully rare that you will need to do this, but if you need to troubleshoot Tugboat:
**You need to be connected to SOCKS in order for this to work.**
Install `tugboat-cli` using these directions: https://docs.tugboatqa.com/tugboat-cli/install-the-cli/
Set an access code here: https://tugboat.vfs.va.gov/access-tokens
Add the access code to `.tugboat/.tugboat.yml` from this repo and copy it to your home directory.
`tugboat ls repos` should list the projects from https://tugboat.vfs.va.gov/projects
