# CMS Preview

Next-build operates as a dynamic preview server for the CMS. This allows CMS content to be viewed by editors before it is live on VA.gov, to ensure it appears as expected before publication.

This requires some configuration for the systems to communicate with each other successfully. Environment variables for authentication must be set on the next-build side, and certain key pairs must be added to the CMS environment. Furthermore, each environment must know the name of the respective server it should be interacting with.

To build the output for a preview server (**not a full static build, which disables next.js API routes**), run `yarn build:preview`.

This compiles everything necessary for a running next.js server, which can be started with `yarn start`. Requests made to this running server treat everything as a dynamic request, as there were no pages pre-built statically. Preview requests can also be made if properly formed. Next.js requires certain query parameters to preview requests. The requests made using the CMS Preview Button assemble these query parameters automatically when the link is generated.

## Requirements

For CMS Preview to work, next-build requires three environment variables:

```sh
# for Drupal preview
DRUPAL_PREVIEW_SECRET=secret
DRUPAL_CLIENT_ID=Retrieve this from AWS SSM /cms/consumers/next-build/client_id
DRUPAL_CLIENT_SECRET=Retrieve this from AWS SSM /cms/consumers/next-build/client_secret
```

The CMS requires a pair of OAuth keys in the docroot (outside of the webroot) to verify the `DRUPAL_CLIENT_ID` and `DRUPAL_CLIENT_SECRET` values. This is explained further below. It also needs configuration updated to point at the correct next-build server. This defaults a localhost running from `yarn dev`, but the variables are updated on a per-environment basis in the various `settings.*.php` files in the va.gov-cms repo.

Currently, next-build powered Preview is gated behind a feature flag, `NEXT_STORY_PREVIEW`, that will also need to be enabled on your CMS environment.

### OAuth Keys

To test the preview API route locally, you will also need to add public and private OAuth keys to your local clone of the va.gov-cms root directory at `public.key` and `private.key` respectively. These files are gitignored in the va.gov-cms repo.

```
-----BEGIN PUBLIC KEY-----
Retrieve this value from AWS SSM @ /cms/staging/drupal_api_users/next_build_api/public.key
-----END PUBLIC KEY-----
```

```
-----BEGIN RSA PRIVATE KEY-----
Retrieve this value from AWS SSM @ /cms/staging/drupal_api_users/next_build_api/private.key
-----END RSA PRIVATE KEY-----
```

These keys are placed in the correct locations for BRD environments via [ansible in the devops repo](https://github.com/department-of-veterans-affairs/devops/blob/4de7a1cc6063928e2415dc8c80f6578f4d6906dc/ansible/deployment/config/cms-vagov-prod.yml#L179).

### Content configuration

Configuration for previewing new content types will need to be created & exported before content of that type can be previewing using next-build.

The content type must be configured to use the next-build preview server in the CMS at https://va-gov-cms.ddev.site/admin/config/services/next/entity-types.

Additionally, the `PreviewEventSubscriber` in the `va_gov_preview` module will need updated to allow for additional types. See `PreviewEventSubscriber->checkNextEnabledTypes()` for more information.

Without this configuration, preview functionality will fall back to using the current content-build provided preview server.

### Drupal scope

When a new role is added to Drupal, we should also create a corresponding [scope](https://va.gov/admin/config/people/simple_oauth/oauth2_scope/dynamic) if the holders of this role need to be able to see Next previews. After the scope is created, exported in config, and deployed onto prod, it will need to be added to the [consumer](https://va.gov/admin/config/services/consumer/2/edit) directly on prod since consumers are entities in the DB and not part of config.

## CMS Tugboat Preview

Each CMS Tugboat environment installs next-build, runs `yarn build:preview` and then starts a running preview server. This allows Preview functionality to be tested on each CMS PR with all the wiring hooked up for you.

See the [CMS Pull Request Environment Main Preview](https://tugboat.vfs.va.gov/61843ae5690c684ac687095f) for more information.
