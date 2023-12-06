import os
import argparse
import pprint
import boto3
import botocore
from botocore.config import Config

boto_config = Config(
    region_name='us-gov-west-1',
)

parser = argparse.ArgumentParser(description='Update Launch Templates.')
parser.add_argument('-n', '--name', required=True)
parser.add_argument('-s', '--asGroup', required=True)
parser.add_argument('-a', '--amiId', required=True)
parser.add_argument('-d', '--dryRun', action="store_true")
parser.add_argument('-m', '--mixedPolicy', action='store_true', help='flag to update asg if using MixedInstancesPolicy')
args = parser.parse_args()

session = boto3.Session()
ec2 = session.client('ec2', config=boto_config)
try:
    launch_template = ec2.describe_launch_templates(
        LaunchTemplateNames=[args.name]
    )
except botocore.exceptions.ClientError as error:
    print(error)

print("Updating Launch Template " + args.name + " , Current Version: " +
      str(launch_template['LaunchTemplates'][0]['LatestVersionNumber']) + ", ID: " + launch_template['LaunchTemplates'][0]['LaunchTemplateId'])

try:
    create_response = ec2.create_launch_template_version(
        LaunchTemplateData={
            'ImageId': args.amiId,
        },
        LaunchTemplateId=launch_template['LaunchTemplates'][0]['LaunchTemplateId'],
        SourceVersion=str(
            launch_template['LaunchTemplates'][0]['LatestVersionNumber'])
    )
except botocore.exceptions.ClientError as error:
    print(error)

print("New Launch Template version created: " + str(create_response['LaunchTemplateVersion']['VersionNumber']) +
      ". Updating default version for " + create_response['LaunchTemplateVersion']['LaunchTemplateId'] + "...")

try:
    update_response = ec2.modify_launch_template(
        DefaultVersion=str(
            create_response['LaunchTemplateVersion']['VersionNumber']),
        LaunchTemplateId=create_response['LaunchTemplateVersion']['LaunchTemplateId'],
    )
except botocore.exceptions.ClientError as error:
    print(error)

pp = pprint.PrettyPrinter(indent=4)
pp.pprint(update_response)


autoscaling = session.client('autoscaling', config=boto_config)

print("Updating Autoscaling Group: " + args.asGroup + ".  ")
try:
    if args.mixedPolicy is True:
        print("updating MixedInstancesPolicy")
        update_asg_response = autoscaling.update_auto_scaling_group(
            AutoScalingGroupName=args.asGroup,
            MixedInstancesPolicy={
                'LaunchTemplate': {
                    'LaunchTemplateSpecification': {
                        'LaunchTemplateId': create_response['LaunchTemplateVersion']['LaunchTemplateId'],
                        'Version': str(create_response['LaunchTemplateVersion']['VersionNumber']),
                    }
                }
            }
        )
    else:
        print("updating LaunchTemplate")
        update_asg_response = autoscaling.update_auto_scaling_group(
            AutoScalingGroupName=args.asGroup,
            LaunchTemplate={
                'LaunchTemplateId': create_response['LaunchTemplateVersion']['LaunchTemplateId'],
                'Version': str(create_response['LaunchTemplateVersion']['VersionNumber']),
            }
        )
except botocore.exceptions.ClientError as error:
    print(error)

pp.pprint(update_asg_response)
