# PACKAGE_NAME
PACKAGE_DESCRIPTION

![image](https://img.shields.io/github/license/leal32b/PACKAGE_NAME?style=flat-square)
![image](https://img.shields.io/npm/v/PACKAGE_NAME?style=flat-square)
![image](https://img.shields.io/npm/dw/PACKAGE_NAME?style=flat-square)
![image](https://img.shields.io/circleci/build/github/leal32b/PACKAGE_NAME/main?style=flat-square)
![image](https://img.shields.io/codecov/c/gh/leal32b/PACKAGE_NAME?style=flat-square)
![image](https://img.shields.io/github/issues/leal32b/PACKAGE_NAME?style=flat-square)


Technologies:
- [Typescript](https://typescriptlang.org)
- [Eslint](https://eslint.org)
- [StandardJS](https://standardjs.com)
- [git-commit-msg-linter](https://github.com/legend80s/commit-msg-linter)
- [husky](https://typicode.github.io/husky)
- [lint-staged](https://github.com/okonet/lint-staged)
- [jest](https://jestjs.io)
- [npmjs](https://npmjs.com)
- [Codecov](https://codecov.io)
- [Circleci](https://circleci.com)
- [Shields](http://shields.io)

# Examples
## Installation
```bash
npm install PACKAGE_NAME
```

## Usage
```javascript
// javascript
const PACKAGE_NAME = require('PACKAGE_NAME')
```

```typescript
// typescript
import PACKAGE_NAME from 'PACKAGE_NAME'
```

```typescript
// Calling example function
PACKAGE_NAME.greeter('Johnn Doe')  // Hello John Doe!
```

# Licence
LICENSE_TYPE



# == EXCLUDE THIS SECTION AFTER YOU FINISH ALL CONFIGS ==
# Quick start
```bash
# Clone repository
$ git clone git@github.com:leal32b/template-npmjs.git PACKAGE_NAME
# Go into the repository
$ cd PACKAGE_NAME
# Run setup
$ npm run setup
```

# Npmjs config
- Click on your profile picture and then "Access Tokens"
- Click on "Generate New Token"
- Provide your password if asked
- If the generated token is of type `Read-only`, delete this token and click on "Generate New Token" again
- Select type `Automation` and click on "Generate Token"
- Copy/save this value (it won't be showed ever again)
# Circleci config
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

# Github config [optional]
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

# Badges [optional]
- Adjust shields.io urls in this README
