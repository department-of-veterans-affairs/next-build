#!/usr/bin/env bash

set -e
set -o pipefail

################################################################
# Migrate existing folder to a new partition
# 
# Globals:
#   None
# Arguments:
#   1 - the path of the disk or partition
#   2 - the folder path to migration
#   3 - the mount options to use.
# Outputs:
#   None
################################################################
migrate_and_mount_disk() {
    local disk_name=$1
    local folder_path=$2
    local mount_options=$3
    local temp_path="/mnt${folder_path}"
    local old_path="${folder_path}-old"

    # install an ext4 filesystem to the disk
    mkfs.xfs ${disk_name}

    # check if the folder already exists
    if [ -d "${folder_path}" ]; then
        mkdir -p ${temp_path}
        mount ${disk_name} ${temp_path}
        cp -Rax ${folder_path}/* ${temp_path} || true
        mv ${folder_path} ${old_path} || true
        umount ${disk_name}
    fi

    # create the folder
    mkdir -p ${folder_path}

    # add the mount point to fstab and mount the disk
    echo "UUID=$(blkid -s UUID -o value ${disk_name}) ${folder_path} xfs ${mount_options} 0 1" >> /etc/fstab
    mount -a
}

################################################################
# Partition the disks based on the standard layout for common
# hardening frameworks
# 
# Globals:
#   None
# Arguments:
#   1 - the name of the disk
# Outputs:
#   None
################################################################
partition_disks() {
    local disk_name=$1

    # partition the disk
    parted -a optimal -s "${disk_name}" \
        mklabel gpt \
        mkpart runner xfs 0% 90%

    # wait for the disks to settle
    sleep 5

    # migrate and mount the existing
    migrate_and_mount_disk "${disk_name}p1" /home/runner defaults,nofail,nodev
}

partition_disks /dev/nvme2n1