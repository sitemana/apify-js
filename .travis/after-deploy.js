const { execSync } = require('child_process');
const VERSION = require('../package.json').version;

const GIT_TAG = `v${VERSION}`;

const { GH_TOKEN, TRAVIS } = process.env;

if (!TRAVIS) throw new Error('This script is supposed to run on Travis only. ' +
    'If you want to run it locally, you\'ll need to set some env vars and it will overwrite your Git credentials so tread carefully.');

if (process.env.TRAVIS_TAG) {
    // Only latest releases will have a tag.
    console.log('after-deploy: Skipping git tag because it\'s a tagged build.');
    process.exit(0);
}

console.log('after-deploy: Setting up git.');
execSync('git config --global user.email "travis@travis-ci.org"');
execSync('git config --global user.name "Travis CI"');

console.log('after-deploy: Adding new origin with token.');
execSync(`git remote add origin-token https://${GH_TOKEN}@github.com/apifytech/apify-js > /dev/null 2>&1`);

console.log(`after-deploy: Tagging commit with tag: ${GIT_TAG}.`);
execSync(`git tag ${GIT_TAG}`);

console.log('after-deploy: Pushing changes to remote.');
execSync(`git reset HEAD`);
execSync(`git push --set-upstream origin-token master ${GIT_TAG}`);
