#!/bin/bash -e

# deploy.sh
# deploys the content and necessary assets from `yarn export` to s3 content buckets

ME=$(basename "$0")

DEST=""
SOURCE=""
VERBOSE="no"
EXIT_OK=no

function usage {
    echo "$ME: perform a sync'ed deploy of static assets using 'aws s3 sync'"
    echo "Usage: $ME -s SOURCE -d DEST [-w WORKDIR] [-v]"
    echo "  -s : The folder containing static assets to be deployed"
    echo "  -d : An S3 URL to the website bucket to deploy to"
    echo "  -v : Use verbose output"
}

function say {
    if [ "$VERBOSE" == "yes" ] ; then
        echo "$1"
    fi
}

function say_err {
    >&2 echo "$1"
}

function bail {
    say_err "$1"
    exit 2
}

while getopts ":d:s:vw:h" option ; do
    case $option in
        d) DEST="$OPTARG" ;;
        s) SOURCE="$OPTARG" ;;
        v) VERBOSE="yes" ;;
        \?) bail "Invalid option: $OPTARG" ;;
        h) usage ; exit 0 ;;
        *) bail "Something went wrong with argument parsing, use the -h arg for help" ;;
    esac
done
shift $((OPTIND - 1))

# Exit if source or destination is missing
if [ -z "$SOURCE" ] || [ -z "$DEST" ]; then
    say_err "ERROR: Missing required source or destination"
    usage
    exit 1
fi

say "INFO: Starting up..."
say "INFO:  -> Deploying $SOURCE to $DEST"

cd "$SOURCE"

# Sync needed assets to s3
say "INFO: Syncing assets to $DEST"
aws s3 sync --only-show-errors \
    --acl public-read \
    --cache-control "public, no-cache" \
    --exclude '*' \
    --include '*.js' \
    --include '*.css' \
    --include '*.png' \
    --include '*.jpg' \
    --include '*.svg' \
    --include 'data/cms/*.json' \
    . "$DEST"

# Sync content to s3
say "INFO: Syncing all content to $DEST"
aws s3 sync --only-show-errors \
    --acl public-read \
    --cache-control "public, no-cache" \
    --delete \
    . "$DEST"

cd ..

EXIT_OK=yes
