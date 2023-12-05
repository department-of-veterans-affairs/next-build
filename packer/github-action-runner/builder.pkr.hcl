build {
  sources = [
    "source.amazon-ebs.gha-runner"
  ]

  provisioner "shell" {
    inline = ["sudo cloud-init status --wait"]
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
    ]
    execute_command = "sudo sh -c \"{{ .Vars }} {{ .Path }}\""
    scripts = [
      "${path.root}/scripts/runner.sh",
      "${path.root}/scripts/openssl-config.sh",
      "${path.root}/scripts/playwright-dependencies.sh"

    ]
  }

  provisioner "shell" {
    execute_command = "sudo /bin/bash '{{ .Path }}'"
    script          = "${path.root}/scripts/docker-prune-cron.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /opt/post-generation",
      "sudo chmod -R 777 /opt/post-generation"
    ]
  }

  provisioner "file" {
    destination = "/opt/post-generation/unregister-github-runners.sh"
    source      = "${path.root}/scripts/unregister-github-runners.sh"
  }

  provisioner "shell" {
    execute_command = "sudo /bin/bash '{{ .Path }}'"
    script          = "${path.root}/scripts/stig.sh"
  }

  provisioner "shell" {
    execute_command = "sudo /bin/bash '{{ .Path }}'"
    script          = "${path.root}/scripts/runner-partition.sh"
  }

  provisioner "shell" {
    execute_command = "sudo /bin/bash '{{ .Path }}'"
    script          = "${path.root}/scripts/cleanup.sh"
  }

  post-processor "manifest" {
    output = "${path.root}/manifest.json"
  }
}
