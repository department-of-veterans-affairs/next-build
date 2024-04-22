# Datasync for Next-Build

Refer to [Use of AWS Datasync to Facilitate Accelerated Publishing Operations](https://github.com/department-of-veterans-affairs/va.gov-cms/blob/main/READMES/datasync.md) for architecture overall design.

Datasync resources are defined in the terraform-aws-vsp-cms repo, in [datasync.tf](https://github.com/department-of-veterans-affairs/terraform-aws-vsp-cms/blob/main/datasync.tf):

- efs-to-s3-datasync-lambda-schedule
- efs-to-s3-datasync-lambda-target
- cms-efs-source-location
- cms-s3-destination-location
- cms-datasync-task
- datasync-bucket-access-role
- efs-to-s3-datasync-lambda-role
- efs-to-s3-datasync-lambda-role-attachment
- efs-to-s3-datasync-lambda
- efs-to-s3-datasync-lambda-allow-cloudwatch

Deploy Terraform updates using:

```
terraform apply \
-target=module.cms.aws_cloudwatch_event_rule.efs-to-s3-datasync-lambda-schedule \
-target=module.cms.aws_cloudwatch_event_target.efs-to-s3-datasync-lambda-target \
-target=module.cms.aws_datasync_location_efs.cms-efs-source-location \
-target=module.cms.aws_datasync_location_s3.cms-s3-destination-location \
-target=module.cms.aws_datasync_task.cms-datasync-task \
-target=module.cms.aws_iam_role.datasync-bucket-access-role \
-target=module.cms.aws_iam_role.efs-to-s3-datasync-lambda-role \
-target=module.cms.aws_iam_role_policy_attachment.efs-to-s3-datasync-lambda-role-attachment \
-target=module.cms.aws_lambda_function.efs-to-s3-datasync-lambda \
-target=module.cms.aws_lambda_permission.efs-to-s3-datasync-lambda-allow-cloudwatch
```

or, for CMS-Test:

```
terraform apply \
-target=module.cms-test.aws_cloudwatch_event_rule.efs-to-s3-datasync-lambda-schedule \
-target=module.cms-test.aws_cloudwatch_event_target.efs-to-s3-datasync-lambda-target \
-target=module.cms-test.aws_datasync_location_efs.cms-efs-source-location \
-target=module.cms-test.aws_datasync_location_s3.cms-s3-destination-location \
-target=module.cms-test.aws_datasync_task.cms-datasync-task \
-target=module.cms-test.aws_iam_role.datasync-bucket-access-role \
-target=module.cms-test.aws_iam_role.efs-to-s3-datasync-lambda-role \
-target=module.cms-test.aws_iam_role_policy_attachment.efs-to-s3-datasync-lambda-role-attachment \
-target=module.cms-test.aws_lambda_function.efs-to-s3-datasync-lambda \
-target=module.cms-test.aws_lambda_permission.efs-to-s3-datasync-lambda-allow-cloudwatch
```

After making changes, remember to bump up the CMS module versions in the [devops repo](https://github.com/department-of-veterans-affairs/devops), for example in [this PR](https://github.com/department-of-veterans-affairs/devops/pull/14020/files).
