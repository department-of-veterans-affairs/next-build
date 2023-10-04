#!/usr/bin/env bash
if [ ! -d ../vets-website ]; then
  git clone --single-branch --depth 1 https://github.com/department-of-veterans-affairs/vets-website.git ../vets-website
else
  echo "Repo vets-website already cloned."
fi