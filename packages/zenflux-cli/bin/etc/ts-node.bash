#!/bin/bash

source "$HOME/.nvm/nvm.sh"

nvm use 18.18.1 > /dev/null

DEV="--no-warnings"
DEBUG="--inspect-brk --trace-warnings"

NODE_OPTIONS="--loader=ts-node/esm ${DEV}" ts-node --preferTsExts \
--esm \
--files \
--project etc/ts-direct.tsconfig.json \
--transpile-only \
--log-error \
--experimental-specifier-resolution=node \
--script-mode etc/ts-direct.ts
