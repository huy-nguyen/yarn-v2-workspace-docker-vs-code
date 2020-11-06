# This is a mutli-stage Docker build. Stage 1 (named `manifests`) collects
# dependency manifest files (`package.json` and `yarn.lock`) which are then
# used by stage 2 to install these dependencies into the final image used for
# development. The only reason we need a separate stage just for collecting the
# dependency manifests is that Docker's `COPY` command still does not allow
# copying based on a glob pattern (see this GitHub issue for more details
# https://github.com/moby/moby/issues/15858). Being able to copy only manifests
# into stage 2 (the `COPY --from=manifests` statement) is important to maximize
# Docker build cache hit rate. `alpine` is chosen as the base image for the
# first stage because it's the smallest image that have access to the `cp
# --parents -t` command (by installing the `coreutils` package).

FROM alpine:3.11 as manifests
RUN apk add coreutils

WORKDIR /tmp
COPY ./ ./src
RUN mkdir manifests && \
  cd src && \
  # Note: need to exclude `.vscode` directory because the `package.json` file
  # it contains is not a dependency manifest:
  find . -name 'package.json' \! -path '*\.vscode*' | xargs cp --parents -t ../manifests/ && \
  cp yarn.lock ../manifests/

# Second build stage:
FROM node:12.16.1

ARG REPO_MOUNT_POINT
ARG REPO_MOUNT_POINT_PARENT
ARG MAIN_YARN_DIR
ARG COMMIT_YARN_CLI
ARG COMMIT_YARN_WORKSPACE_TOOLS_PLUGIN
ARG COMMIT_YARN_TYPESCRIPT_PLUGIN


# This reduces "delaying package configuration, since apt-utils is not
# installed" message. Reference:
# https://code.visualstudio.com/docs/remote/containers-advanced#_avoiding-extension-reinstalls-on-container-rebuild
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get -yqq install --no-install-recommends apt-utils 2>&1

# Every directory created here is `chown`ed to `node` because all development
# at container runtime will be done under the `node` user. It's good practice
# to avoid running as `root` wheneer possible.
RUN mkdir $REPO_MOUNT_POINT && \
  chown -R node:node ${REPO_MOUNT_POINT} && \
  touch ${REPO_MOUNT_POINT_PARENT}/.yarnrc.yml && \
  chown node:node ${REPO_MOUNT_POINT_PARENT}/.yarnrc.yml && \
  mkdir ${MAIN_YARN_DIR} && \
  chown -R node:node ${MAIN_YARN_DIR} && \
  mkdir ${MAIN_YARN_DIR}/releases && \
  chown -R node:node ${MAIN_YARN_DIR}/releases && \
  mkdir ${MAIN_YARN_DIR}/cache && \
  chown -R node:node ${MAIN_YARN_DIR}/cache && \
  mkdir ${MAIN_YARN_DIR}/global && \
  chown -R node:node ${MAIN_YARN_DIR}/global && \
  mkdir ${MAIN_YARN_DIR}/\$\$virtual && \
  chown -R node:node ${MAIN_YARN_DIR}/\$\$virtual && \
  mkdir ${MAIN_YARN_DIR}/unplugged && \
  chown -R node:node ${MAIN_YARN_DIR}/unplugged

WORKDIR ${REPO_MOUNT_POINT}

USER node

# The content of the resulting `~/.yarnrc` file in the next step looks like
# this:
# yarn-path "/yarn/releases/yarn-berry.js"

# This step is roughly equivalent to running `yarn set version berry`, which 1)
# downloads the latest version of Yarn v2 CLI executable to the
# $MAIN_YARN_DIR/releases directory and 2) creates a `.yarnrc` in a location
# accessible to Yarn that tells the system-wide Yarn (which can be either v1 or
# v2) where to find the Yarn executable for the *current* project. Note: Hash
# in the URL is explicitly specified for reproducibility and will need to be
# updated when new versions of Yarn are released.
RUN curl -s https://raw.githubusercontent.com/yarnpkg/berry/$COMMIT_YARN_CLI/packages/berry-cli/bin/berry.js > ${MAIN_YARN_DIR}/releases/yarn-berry.js && \
  echo "yarn-path \"${MAIN_YARN_DIR}/releases/yarn-berry.js\"" > ~/.yarnrc

# The following lines copy the plugins `@yarnpkg/plugin-workspace-tools`
# so that it can be specified in `.yarnrc.yml`.
# The URL points to the current version (at the time of writing) of this file:
# https://github.com/yarnpkg/berry/blob/master/packages/plugin-workspace-tools/bin/%40yarnpkg/plugin-workspace-tools.js
RUN curl -s https://raw.githubusercontent.com/yarnpkg/berry/$COMMIT_YARN_WORKSPACE_TOOLS_PLUGIN/packages/plugin-workspace-tools/bin/%40yarnpkg/plugin-workspace-tools.js -o ${MAIN_YARN_DIR}/plugin-workspace-tools.js

# This instruction writes the `.yarnrc.yml` to $MAIN_YARN_DIR.
# The ugliness is needed to save multiline string to a file. For reference, see:
# https://www.virtuallyghetto.com/2017/04/quick-tip-creating-a-multiline-dockerfile-using-heredoc-wvariable-substitution.html

# The content of the resultant `.yarnrc.yml` looks like this:
# bstatePath: "/yarn/build-state.yml"
# cacheFolder: "/yarn/cache"
# globalFolder: "/yarn/global"
# virtualFolder: "/yarn/$$virtual"
# pnpUnpluggedFolder: "/yarn/unplugged"
#   - path: "/yarn/plugin-workspace-tools.js"
#     spec: "@yarnpkg/plugin-interactive-tools"
# packageExtensions:
#   fork-ts-checker-webpack-plugin@*:
#     peerDependencies:
#       typescript: "*"

# Note that the entry for `packageExtensions` is a temporary workaround for
# `fork-ts-checker-webpack-plugin` because it incorrectly omits `typescript` as
# a peer dependency. See
# https://yarnpkg.com/advanced/migration#a-package-is-trying-to-access-another-package-

RUN echo 'bstatePath: "'${MAIN_YARN_DIR}'/build-state.yml"\n\
cacheFolder: "'${MAIN_YARN_DIR}'/cache"\n\
globalFolder: "'${MAIN_YARN_DIR}'/global"\n\
virtualFolder: "'${MAIN_YARN_DIR}'/$$virtual"\n\
pnpUnpluggedFolder: "'${MAIN_YARN_DIR}'/unplugged"\n\
plugins:\n\
  - path: "'${MAIN_YARN_DIR}'/plugin-workspace-tools.js"\n\
    spec: "@yarnpkg/plugin-interactive-tools"\n\
packageExtensions:\n\
  fork-ts-checker-webpack-plugin@*:\n\
    peerDependencies:\n\
      typescript: "*"\n\
' >> ${REPO_MOUNT_POINT_PARENT}/.yarnrc.yml

# Copy `yarn.lock` and all `package.json` files from the first build stage in
# preparation for `yarn install`.
COPY --from=manifests --chown=node:node /tmp/manifests  ./

# Install all dependencies and verify that `yarn.lock` will not be modified
# during the process. If `yarn.lock` needs to be modified, this step is
# deliberately designed to fail (Please refer to the article for the remedy.).
# This is to prevent `yarn.lock` from going out-of-sync with the `package.json`
# files inside each workspace, which can happen if npm is used as the package
# manager on the host side.
RUN yarn install --immutable --inline-builds
