#!/usr/bin/env node

/*
Parts of code from https://github.com/react-boilerplate/react-boilerplate
The MIT License (MIT)
Copyright (c) 2019 Maximilian Stoiber
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const chalk = require('chalk')
const compareVersions = require('compare-versions')
const inquirer = require('inquirer')
const rimraf = require('rimraf')
const shell = require('shelljs')

const addCheckMark = require('./helpers/checkmark')
const npmConfig = require('./helpers/get-npm-config')
const animateProgress = require('./helpers/progress')
const addXMark = require('./helpers/xmark')

let newNpmConfig = {}

process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdout.write('\n')
let interval = -1

/**
 * Deletes a file in the current directory
 * @param {string} file
 * @returns {Promise<any>}
 */
function deleteFileInCurrentDir (file) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, file), (err) => reject(new Error(err)))
    resolve()
  })
}

/**
 * Checks if we are under Git version control
 * @returns {Promise<boolean>}
 */
function hasGitRepository () {
  return new Promise((resolve, reject) => {
    exec('git status', (err, stdout) => {
      if (err) {
        reject(new Error(err))
      }

      const regex = new RegExp(/fatal:\s+Not\s+a\s+git\s+repository/, 'i')

      /* eslint-disable-next-line no-unused-expressions */
      regex.test(stdout) ? resolve(false) : resolve(true)
    })
  })
}

/**
 * Checks if this is a clone from our repo
 * @returns {Promise<any>}
 */
function checkIfRepositoryIsAClone () {
  return new Promise((resolve, reject) => {
    exec('git remote -v', (err, stdout) => {
      if (err) {
        reject(new Error(err))
      }

      const isClonedRepo = stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith('origin'))
        .filter((line) => /leal32b\/template-npmjs\.git/.test(line)).length

      resolve(!!isClonedRepo)
    })
  })
}

/**
 * Remove the current Git repository
 * @returns {Promise<any>}
 */
function removeGitRepository () {
  return new Promise((resolve, reject) => {
    try {
      shell.rm('-rf', '.git/')
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * @async
 * Ask user about starting new repository.
 * @returns {Promise<boolean>}
 */
async function askUserIfWeShouldRemoveRepo () {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isNew',
      message: 'Do you want to start with a new repository',
      default: 'y'
    }
  ])
  return answer.isNew
}

/**
 * @async
 * Checks if we are under Git version control.
 * If we are and this a clone of our repository the user is given a choice to
 * either keep it or start with a new repository.
 * @returns {Promise<boolean>}
 */
async function cleanCurrentRepository () {
  const hasGitRepo = await hasGitRepository().catch((reason) =>
    reportError(reason)
  )

  // We are not under Git version control. So, do nothing
  if (hasGitRepo === false) {
    return false
  }

  const isClone = await checkIfRepositoryIsAClone().catch((reason) =>
    reportError(reason)
  )
  // Not our clone so do nothing
  if (isClone === false) {
    return false
  }

  const answer = await askUserIfWeShouldRemoveRepo()

  if (answer === true) {
    process.stdout.write('Removing current repository')
    await removeGitRepository().catch((reason) => reportError(reason))
    addCheckMark()
  }

  return answer
}

/**
 * Check Node.js version
 * @param {!number} minimalNodeVersion
 * @returns {Promise<any>}
 */
function checkNodeVersion (minimalNodeVersion) {
  return new Promise((resolve, reject) => {
    exec('node --version', (err, stdout) => {
      const nodeVersion = stdout.trim()
      if (err) {
        reject(new Error(err))
      } else if (compareVersions(nodeVersion, minimalNodeVersion) === -1) {
        reject(
          new Error(
            `You need Node.js v${minimalNodeVersion} or above but you have v${nodeVersion}`
          )
        )
      }

      resolve('Node version OK')
    })
  })
}

/**
 * Check NPM version
 * @param {!number} minimalNpmVersion
 * @returns {Promise<any>}
 */
function checkNpmVersion (minimalNpmVersion) {
  return new Promise((resolve, reject) => {
    exec('npm --version', (err, stdout) => {
      const npmVersion = stdout.trim()
      if (err) {
        reject(new Error(err))
      } else if (compareVersions(npmVersion, minimalNpmVersion) === -1) {
        reject(
          new Error(
            `You need NPM v${minimalNpmVersion} or above but you have v${npmVersion}`
          )
        )
      }

      resolve('NPM version OK')
    })
  })
}

/**
 * Install all packages
 * @param packageManager - One of: 'npm'|'yarn'|'pnpm'.
 * @returns {Promise<any>}
 */
function installPackages (packageManager) {
  return new Promise((resolve, reject) => {
    process.stdout.write(
      '\nInstalling dependencies... (This might take a while)\n'
    )

    setTimeout(() => {
      readline.cursorTo(process.stdout, 0)
      interval = animateProgress('Installing dependencies')
    }, 500)

    let execArgs
    switch (packageManager) {
      case 'npm':
        execArgs = ['npm', 'install']
        break
      case 'yarn':
        execArgs = ['yarn', 'install']
        break
      case 'pnpm':
        execArgs = ['pnpm', 'install']
        break
      default:
        process.stderr.write(
          `Provided package manager '${packageManager}' is not supported`
        )
        break
    }

    exec(execArgs.join(' '), (err) => {
      if (err) {
        reject(new Error(err))
      }

      clearInterval(interval)
      addCheckMark()
      resolve('Packages installed')
    })
  })
}

/**
 * Initialize a new Git repository
 * @returns {Promise<any>}
 */
function initGitRepository () {
  return new Promise((resolve, reject) => {
    exec('git init', (err, stdout) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(stdout)
      }
    })
  })
}

/**
 * Add all files to the new repository.
 * @returns {Promise<any>}
 */
function addToGitRepository () {
  return new Promise((resolve, reject) => {
    exec('git add .', (err, stdout) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(stdout)
      }
    })
  })
}

/**
 * Initial Git commit
 * @returns {Promise<any>}
 */
function commitToGitRepository () {
  return new Promise((resolve, reject) => {
    exec('git commit -m "chore: initial commit" --allow-empty', (err, stdout) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(stdout)
      }
    })
  })
}

/**
 * Report the the given error and exits the setup
 * @param {string} error
 */
function reportError (error) {
  clearInterval(interval)

  if (error) {
    process.stdout.write('\n\n')
    addXMark(() => process.stderr.write(chalk.red(` ${error}\n`)))
    process.exit(1)
  }
}

/**
 * End the setup process
 */
function endProcess () {
  clearInterval(interval)
  process.stdout.write(chalk.blue('\n\nDone!\n'))
  process.exit(0)
}

/**
 * @async
 * Ask user about used package manager.
 * @returns {Promise<'npm'|'yarn'|'pnpm">}
 */
async function askUserAboutUsedPackageManager () {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you want to use',
      choices: ['npm', 'yarn', 'pnpm'],
      filter: function (val) {
        return val.toLowerCase()
      }
    }
  ])
  return answer.packageManager
}

/**
 * @async
 * Ask user about project details.
 * @returns {Promise<Object>}
 */
async function askUserAboutProjectDetails () {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: "What's the project name"
    },
    {
      type: 'input',
      name: 'description',
      message: "What's the project description"
    },
    {
      type: 'input',
      name: 'authorName',
      message: "Who's the project author"
    }
  ];

  const answer = await inquirer.prompt(questions)
  answer.author = answer.authorName
  delete answer.authorName

  const questions2 = [
    {
      type: 'input',
      name: 'homepage',
      message:
        "What's the project's homepage: https://github.com//<AUTHOR-NAME>/<PACKAGE-NAME>#readme",
      default: `https://github.com/${answer.author}/${answer.name}#readme`
    },
    {
      type: 'input',
      name: 'bugs',
      message: "What's the project's Github issue page(bugs): https://github.com/<AUTHOR-NAME>/<PACKAGE-NAME>/issues",
      default: `https://github.com/${answer.author}/${answer.name}/issues`
    },
    {
      type: 'input',
      name: 'license',
      message: "What's the project's license",
      default: 'MIT'
    },
    {
      type: 'confirm',
      name: 'isRemovable',
      message: 'Do you want to remove example code under ./src and ./test',
      default: false
    }
  ]
  
  const answer2 = await inquirer.prompt(questions2)

  return { ...answer, ...answer2 }
}

/**
 * Assigns new project details to npm config(package.json).
 * @param {Object} projectDetails - New project details.
 */
function updateNpmConfig (projectDetails) {
  projectDetails.version = '0.0.0'
  newNpmConfig = Object.assign({}, npmConfig, projectDetails)
  // Remove setup dependencies
  delete newNpmConfig.devDependencies.inquirer
  delete newNpmConfig.devDependencies.rimraf
  delete newNpmConfig.devDependencies.shelljs
  // Remove setup scripts
  delete newNpmConfig.scripts.presetup
  delete newNpmConfig.scripts.setup

  const stringifiedData = JSON.stringify(newNpmConfig, null, 2)
  fs.writeFileSync('./package.json', stringifiedData)
}

/**
 * @async
 * Clears files related to project.
 */
async function clearFiles (isRemovable) {
  console.log('isRemovable >>>', isRemovable);
  if (isRemovable) {
    // fs.unlinkSync('./src/components/greeter.ts')
    // fs.unlinkSync('./src/index.ts')
    // rimraf.sync('./src/components')
  }

  // README.md
  let readme = fs.readFileSync('./.template-npmjs/templates/README.md', 'utf8')
  readme = readme.replace(/PACKAGE_NAME/g, newNpmConfig.name)
  readme = readme.replace(/PACKAGE_DESCRIPTION/g, newNpmConfig.description)
  readme = readme.replace(/PACKAGE_HOMEPAGE/g, newNpmConfig.homepage)
  readme = readme.replace(/LICENSE_TYPE/g, newNpmConfig.license)
  fs.writeFileSync('./README.md', readme);
  
  // index.ts
  let index = fs.readFileSync('./.template-npmjs/templates/index.ts', 'utf8')
  index = index.replace(/PACKAGE_NAME/g, newNpmConfig.name)
  fs.writeFileSync('./src/index.ts', index);

  // index.test.ts
  let indexTest = fs.readFileSync('./.template-npmjs/templates/index.test.ts', 'utf8')
  indexTest = indexTest.replace(/PACKAGE_NAME/g, newNpmConfig.name)
  fs.writeFileSync('./test/index.test.ts', indexTest);

  rimraf.sync('./.template-npmjs')
}

/**
 * Removes tests.
 * @returns void
 */
function removeTests () {
  rimraf.sync('./test/*')
}

/**
 * @async
 * Run
 */
(async () => {
  const repoRemoved = await cleanCurrentRepository()

  // Take the required Node.js and NPM version from package.json
  // Do not use semver with 'x' like '13.0.x'
  const {
    engines: { node, npm }
  } = npmConfig

  const requiredNodeVersion = node.match(/([0-9.]+)/g)[0]
  await checkNodeVersion(requiredNodeVersion).catch((reason) =>
    reportError(reason)
  )

  const packageManager = await askUserAboutUsedPackageManager()
  const requiredNpmVersion = npm.match(/([0-9.]+)/g)[0]
  await checkNpmVersion(requiredNpmVersion).catch((reason) =>
    reportError(reason)
  )

  let projectDetails
  if (repoRemoved) {
    projectDetails = await askUserAboutProjectDetails()
  }

  await installPackages(packageManager).catch((reason) => reportError(reason))

  if (repoRemoved) {
    process.stdout.write('\n')
    let interval = animateProgress('Initializing new repository')
    process.stdout.write('Initializing new repository')

    try {
      await initGitRepository()
      await addToGitRepository()
      await commitToGitRepository()
      addCheckMark()
      clearInterval(interval)

      process.stdout.write('\n')
      interval = animateProgress('Updating package.json')
      process.stdout.write('Updating package.json')
      updateNpmConfig(projectDetails)
      addCheckMark()
      clearInterval(interval)

      // process.stdout.write('\n')
      // interval = animateProgress('Removing tests')
      // process.stdout.write('Removing tests')
      // removeTests()
      // addCheckMark()
      // clearInterval(interval)

      process.stdout.write('\n')
      interval = animateProgress('Clearing files')
      process.stdout.write('Clearing files')
      await clearFiles(projectDetails.isRemovable)
      deleteFileInCurrentDir('setup.js')
      addCheckMark()
      clearInterval(interval)
    } catch (err) {
      reportError(err)
    }
  }

  endProcess()
})()
