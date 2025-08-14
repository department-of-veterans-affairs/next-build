# Testing on Tugboat and other environments

## Using Tugboat for Next Build work

> [!NOTE]
> On a next-build tugboat, only next-build pages will be visible. You will not be able to access content-build pages; these pages will result in a 404. Therefore, you will not be able to navigate the tugboat in the way you would a typical website, you must go directly to the URL you want to test.

### Next-build Tugboat

Every Next Build PR creates a Tugboat environment using that PR code and runs a static (content release) build on that Tugboat environment. When the static build is complete, you can see what Next Build will look like with your changed code. This Tugboat environment is linked from your Next Build PR, the same way that a CMS Tugboat environment is linked from a va.gov-cms PR.

Note that there are a few limitations to the next-build tugboat instances:

- There are currently CORS errors so they will not show VAMC Facility Real Time Banners
- The Tugboat also does not show content that relies on the facilities API (e.g. Nearby Vet Center content, Static maps from MapBox, Patient wait times)

### Next-build changes using CMS Tugboat

If you need to test Next Build code with test CMS content, this is done through the CMS interface:

1. Set up a CMS Tugboat instance; either a [demo instance](https://tugboat.vfs.va.gov/5ffe2f4dfa1ca136135134f6), or by creating a CMS PR as you would normally do for CMS changes.
2. Within your CMS instance, create your test content.
3. In the Main nav, under Content, go to "Deploy Next Content"

  - Select the next-build branch with your code that you need to test
  - You will most likely keep the "Use default" option selected for vets-website (unless you are needing to test with a specific branch of vets-website, then select the branch you need here)
  - Select "Restart Next Build Server”

4. It will only take 5-10 mins for the server to restart. When it does, your next build changes with your test CMS content will be viewable on the Next Build Tugboat instance.

Note that there are some limitations to the next-build CMS tugboat instances:

  - There are images in the header that currently do not load (Gov banner and VA Logo)
  - `<va-icon>` component does not display

## To test templates in dev.va.gov

This is used when there are limitations in Tugboat and the content you are testing cannot be shown but the work still needs to be fully QA’ed before going live:

- In Drupal CMS, identify the feature toggle that relates to the content type you want to test. (Toggles are found at `/admin/config/system/feature_toggle` in Drupal CMS)
- Within your branch, update the [Dev .env file](https://github.com/department-of-veterans-affairs/next-build/blob/main/envs/.env.dev) with the Feature Toggle for the content-type / template you need to test set to true. This will turn that content type on in the Dev environment.
- Run a [content release on Dev](https://github.com/department-of-veterans-affairs/next-build/actions/workflows/content-release-dev.yml) using the branch with your changes (including the update to the environment file described above)
  - Note that dev updates every night with main. If your changes are not on main you should time the content release run for earlier in the day so there is enough time for it to run, complete and for testing.
- Also be aware if there are others testing on dev so you don't accidentally run a content release and change the state of dev if someone else was using it.
