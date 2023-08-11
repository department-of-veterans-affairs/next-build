# Tugboat

Tugboat is used to generate environment previews for the static site on lower environments.

TKTK: crib relevant tugboat docs from the cms repo

## CLI Setup

Hopefully rare that you will need to do this, but if you need to troubleshoot Tugboat:

You need to be connected to SOCKS in order for this to work.

Install tugboat-cli using these directions: https://docs.tugboatqa.com/tugboat-cli/install-the-cli/

Set an access code here: https://tugboat.vfs.va.gov/access-tokens

Add the access code to `.tugboat/.tugboat.yml` from this repo and copy it to your home directory.

`tugboat ls repos` should list the projects from https://tugboat.vfs.va.gov/projects
