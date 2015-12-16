#!/bin/sh
set -x
set -e

docker login docker.atlassian.io
docker build -t a11y-dashboard .
docker tag -f `docker images -q a11y-dashboard` docker.atlassian.io/atlassian/a11y-dashboard:latest
docker push docker.atlassian.io/atlassian/a11y-dashboard:latest
