#!/bin/bash
export DOCKER_IMAGE_REGISTRY_IP=${DOCKER_IMAGE_REGISTRY_IP:-10.113.56.67}
export CURRENT_BRANCH="$(git branch | sed -ne /*/s/^..//p)"
case $CURRENT_BRANCH in
    master)
        export DOCKER_IMAGE_REGISTRY_PROJECT=ngp-master
        export TAG="$(git tag --contains master)"
        [ -z "$TAG" ] && echo "No tag found containing master branch" && exit 1
        ;;
    develop)
        export DOCKER_IMAGE_REGISTRY_PROJECT=ngp-develop
        export TAG=latest
        ;;
    feature/*)
        export DOCKER_IMAGE_REGISTRY_PROJECT=ngp-feature
        export TAG="$(echo $CURRENT_BRANCH | sed -ne 's/feature.//p')"
        ;;
    release/*)
        export DOCKER_IMAGE_REGISTRY_PROJECT=ngp-release
        export TAG=latest
        ;;
esac
export DOCKER_IMAGE_REGISTRY=${DOCKER_IMAGE_REGISTRY_IP}/${DOCKER_IMAGE_REGISTRY_PROJECT}
[ "$1" = "push" ] && echo pushing tag $TAG to $DOCKER_IMAGE_REGISTRY
[ "$1" != "push" ] && echo local build - tag $TAG to $DOCKER_IMAGE_REGISTRY
echo "Starting build of project in ${PWD}." && ./gradlew && \
    echo "Building Service Docker Image" && docker build -t ${DOCKER_IMAGE_REGISTRY}/onboarding-service:$TAG onboarding-service && \
    echo "Build UI Docker Image" && docker build -t ${DOCKER_IMAGE_REGISTRY}/onboarding-ui:$TAG onboarding-ui && \
    [ "$1" = "push" ] && \
    echo 'Push Service Docker images' && docker push ${DOCKER_IMAGE_REGISTRY}/onboarding-service:$TAG && \
    echo 'Push UI Docker images' && docker push ${DOCKER_IMAGE_REGISTRY}/onboarding-ui:$TAG
