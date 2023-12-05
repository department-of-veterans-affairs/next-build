data "amazon-ami" "platform-ubuntu" {
  filters = {
    name             = "platform-weekly-ubuntu-*"
    root-device-type = "ebs"
  }
  most_recent = true
  owners      = ["008577686731"]
}

source "amazon-ebs" "gha-runner" {
  ami_name             = "next-build-${coalesce(var.custom_type, "gha-runner")}-ubuntu-${formatdate("YYYY-MM-DD'T'hh-mm-ssZ", timestamp())}"
  communicator         = "ssh"
  iam_instance_profile = "dsva-vagov-dev-scratch-jk-role"
  instance_type        = "c5.xlarge"

  # the root volume /dev/sda1 from the source AMI is used and does
  # not need included here

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sdf"
    volume_size           = var.data_volume_size
    volume_type           = "gp3"
  }

  ami_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sdf"
    volume_size           = var.data_volume_size
    volume_type           = "gp3"
  }


  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sdg"
    volume_size           = var.runner_volume_size
    volume_type           = "gp3"
  }

  ami_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sdg"
    volume_size           = var.runner_volume_size
    volume_type           = "gp3"
  }

  skip_create_ami = var.skip_ami
  source_ami      = "${data.amazon-ami.platform-ubuntu.id}"
  ssh_interface   = "public_ip"
  ssh_username    = "ubuntu"
  subnet_filter {
    filters = {
      "tag:environment" = "utility"
      "tag:tier"        = "public"
    }
    most_free = true
    random    = false
  }

  tags = {
    VAECID        = "AWG20180517003"
    group         = "dsva"
    project       = "vagov"
    owner         = "Platform Infrastructure"
    os_type       = "Ubuntu"
    base_ami_name = "{{ .SourceAMIName }}"
    base_ami_tags = "{{ .SourceAMITags.TagName }}"
    platform_sha  = "${var.git_sha}"
  }
}
