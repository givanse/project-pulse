const github = require('./github');
const fs = require('fs-extra');
const path = require('path');
const pick = require('lodash.pick');
const mkdirp = require('mkdirp');

const DESCRIPTORS = path.join(__dirname, '..', 'descriptors');
const PROJECTS = path.join(__dirname, '..', 'public', 'projects');
mkdirp(PROJECTS);

function getProjectPulse(repos) {
  const pulse = {
    forks_count: 0,
    stargazers_count: 0,
    watchers_count: 0,
  };

  for (const repo of repos) {
    pulse.stargazers_count += parseInt(repo.stargazers_count, 10);
    if (!repo.fork) {
      pulse.forks_count += parseInt(repo.forks_count, 10);
    }
    //pulse.watchers_count += repo.watchers_count;
  }

  return pulse;
}

function pruneRepoData(repo) {
  return pick(repo, [
    'full_name',
    'forks_count',
    'fork',
    'stargazers_count',
    'description',
    //'watchers_count',
  ]);
}

async function loadRepos(descriptorJson) {
  const repos = [];

  for (const orgName of descriptorJson.organizations) {
    const orgRepos = await github.orgs(orgName, 'repos');
    for (const fullResponse of orgRepos) {
      repos.push(pruneRepoData(fullResponse));
    }
  }

  for (const {owner, repo} of descriptorJson.repositories) {
    const fullResponse = await github.repo(owner, repo);
    if (fullResponse.message === 'Not Found') {
      console.log(`Not found <${owner}/${repo}>`);
      continue;
    }
    const repoSmall = pruneRepoData(fullResponse);
    repos.push(repoSmall);
  }

  const pulse = getProjectPulse(repos);

  return {pulse, repos};
}

async function getDescriptorJson(fileName) {
  try {
    let filePath = path.join(DESCRIPTORS, fileName);  
    const rawdata = await fs.readFile(filePath);  
    const json = JSON.parse(rawdata);  
    return json;
  } catch(err) {
    console.log(err);
  }
}

async function generateProjectJson(fileName) {
  const descriptor = await getDescriptorJson(fileName);

  const projectJson = await loadRepos(descriptor); 

  const projectName = path.parse(fileName).name;
  projectJson['name'] = projectName;

  const filePath = path.join(PROJECTS, fileName);  
  console.log(filePath);
  fs.writeFile(filePath, JSON.stringify(projectJson));
}

fs.readdir(DESCRIPTORS, (err, files) => {
  for (const fileName of files) {
    generateProjectJson(fileName);
  }
});
