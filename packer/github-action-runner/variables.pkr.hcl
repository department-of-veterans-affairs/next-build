packer {
  required_plugins {
    amazon = {
      version = ">= 1.1.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "skip_ami" {
  type    = bool
  default = true
}

variable "custom_type" {
  type    = string
  default = ""
}

variable "git_sha" {
  type    = string
  default = ""
}

variable "data_volume_size" {
  type    = string
  default = "300"
}

variable "runner_volume_size" {
  type    = string
  default = "120"
}
