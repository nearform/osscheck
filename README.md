# OSS Check

![CI](https://github.com/nearform/osscheck/actions/workflows/ci.yml/badge.svg?event=push)

This application provides a simple user interface to display useful insights related to code repositories within a GitHub organisation.

This application leverages insights produced through the [OpenSSF Scorecard](https://github.com/ossf/scorecard) REST API.

## Prequsites

You will need:

* [Node JS](https://nodejs.org/en) installed
* Access to a Github organisation
* Github Application

[Registering a GH application](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app)

The app will need the following read permissions to: 

* Code
* Commit statuses
* Issues
* Metadata
* Pull requests

We need the AppId, the Private Key and the Installation Id so we can expose them as Env vars in the build step.

## Generating Data

To generate data, you will need to run the following command:

Prior to invoking this command, you will need to set some environment variables provided by the Github application to configure the script that generates the data:

* GH_PRIV_KEY
* GH_APP_ID
* GH_APP_INSTALL_ID

Once set you can run:

```
npm run build:json
```

## Running the application

To run the application you will need to have generated data to display. Once you have generated data:

```
npm i && npm run dev
```

# Additional Information

This project utlises:

- code linting with [ESlint](https://eslint.org) and [prettier](https://prettier.io)
- pre-commit code linting and commit message linting with [husky](https://www.npmjs.com/package/husky) and [commitlint](https://commitlint.js.org/)
- dependabot setup with automatic merging thanks to ["merge dependabot" GitHub action](https://github.com/fastify/github-action-merge-dependabot)
- notifications about commits waiting to be released thanks to ["notify release" GitHub action](https://github.com/nearform/github-action-notify-release)
- PRs' linked issues check with ["check linked issues" GitHub action](https://github.com/nearform/github-action-check-linked-issues)
- Continuous Integration GitHub workflow
