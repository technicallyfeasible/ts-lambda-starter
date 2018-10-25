Typescript AWS Lambda starter
=============================

Starter project for writing AWS Lambda functions in typescript.
Code is compiled using webpack and a single file is exported.
You will still need the node_modules folder but custom code can be compiled for whichever node version you need.

## Setup

    yarn

## Development

This currently just watches the code using webpack but the plan is
to enable running in dev mode using the SAM cli and call your handler
with actual test events.

    yarn dev

## Production

    yarn --production
    env NODE_ENV=production yarn build

