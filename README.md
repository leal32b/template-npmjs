# template-npmjs
Template to create a new npmjs lib

![image](https://img.shields.io/github/license/leal32b/template-npmjs?style=flat-square)
![image](https://img.shields.io/npm/v/template-npmjs?style=flat-square)
![image](https://img.shields.io/npm/dw/template-npmjs?style=flat-square)
![image](https://img.shields.io/circleci/build/github/leal32b/template-npmjs/main?style=flat-square)
![image](https://img.shields.io/codecov/c/gh/leal32b/template-npmjs?style=flat-square)
![image](https://img.shields.io/github/issues/leal32b/template-npmjs?style=flat-square)

## Installation
> npm install template-npmjs

## Example usage
```javascript
// javascript
const templateNpmjs = require('template-npmjs')
```

```typescript
// typescript
import templateNpmjs from 'template-npmjs'
```

```typescript
// Calling example function
templateNpmjs.greeter('Johnn Doe')  // Hello John Doe!
```

## Prerequisites
- [Npmjs](https://npmjs.com) account
- [Codecov](https://codecov.io) account
- [Circleci](https://circleci.com) account

## Project config
- Replace the string `template-npmjs` in the entire repository, with your lib name
- Replace the string `github.com/leal32b` in package.json with `github.com/<your_github_username>`
- Section `Example usage` of this README needs to be updated according to the new functionalities 
- Change version on package.json/package-lock.json to `0.0.0`
- Run `npm ci` to install the initial dependencies
- Commit and push the changes

## Npmjs config
- Click on your profile picture and then "Access Tokens"
- Click on "Generate New Token"
- Provide your password if asked
- If the generated token is of type `Read-only`, delete this token and click on "Generate New Token" again
- Select type `Automation` and click on "Generate Token"
- Copy/save this value (it won't be showed ever again)
## Circleci config
- Allow uncertified orbs (needed for `codecov` orb):
  - Go to "Organization Settings" / "Security" and set "Allow Uncertified Orbs" to `Yes`
- Project set up:
  - Go to "Projects", find this repository and click on "Set Up Project"
  - Choose "Fatest" option (Use the `.circleci/config.yml` in my repo)
  - Insert "main" in the branch input field
  - Click on "Set Up Project"
  - First workflow run will fail on "release" step
  - Go to "Project Settings" / "Environment Variables" and click on "Add Environment Variable" to add a "Name" and a "Value" for each one of this:
    | Name               | Value               |
    |--------------------|---------------------|
    | EMAIL              | `<your_email>`      |
    | GIT_AUTHOR_NAME    | `<github_username>` |
    | GIT_COMMITTER_NAME | `<github_username>` |
    | NPM_TOKEN          | `<previously_copied/saved_npmjs_access_token>`     |
  - Go to "Project Settings" /  "SSH Keys" add a "User Key" (needed to push to `github`)
  - Go back to project's main page and click on "Rerun workflow from start" ("Actions" column)

## Github config [optional]
- Go to repository "Settings" / "Branches"
- Click on "Add rule"
- On Branch name pattern, insert `main`
- Check this options:
  - Require a pull request before merging
    - Require approvals
    - Dismiss stale pull request approvals when new commits are pushed
    - Require review from Code Owners
  - Require status checks to pass before merging
    - Require branches to be up to date before merging
      - Search and add this Status checks: `ci/circleci: build`, `ci/circleci: test`
- Click on "Create"
