const github = require('./github');
const pick = require('lodash.pick');

function getProjectPulse(repos) {
  const pulse = {
    forks_count: 0,
    //stargazers_count: 0,
    watchers_count: 0,
  };

  for (const repo of repos) {
    //pulse.stargazers_count += parseInt(repo.stargazers_count, 10);
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
    //'stargazers_count',
    'description',
    //'watchers_count',
  ]);
}

async function getIssuesStats(repoFullName) {
  const [owner, repo] = repoFullName.split('/');
  const issuesList = await github.issues(owner, repo);

  const issuesStats = {
    open: 0,
    closed: 0
  };
  for (const issue of issuesList) { 
    if (issue.state === 'open') issuesStats.open++; continue;
    if (issue.state === 'closed') issuesStats.closed++; continue; 
    throw new Error(`wrong issue state <${issue.state}>`);
  }

    

  return issuesStats;
}

module.exports = async function (descriptorJson) {
  const repos = [];

  for (const orgName of descriptorJson.organizations) {
    const orgRepos = await github.orgs(orgName, 'repos');
    for (const repoJson of orgRepos) {
      const repoPruned = pruneRepoData(repoJson);
      repoPruned.issuesStats = await getIssuesStats(repoPruned.full_name);
      repos.push(repoPruned);
    }
  }

  for (const {owner, repo} of descriptorJson.repositories) {
    const repoJson = await github.repo(owner, repo);
    if (repoJson.message === 'Not Found') {
      console.log(`Not found <${owner}/${repo}>`);
      continue;
    }
    const repoPruned = pruneRepoData(repoJson);
    repoPruned.issuesStats = await getIssuesStats(repoPruned.full_name);
    repos.push(repoPruned);
  }

  const pulse = getProjectPulse(repos);

  return {pulse, repos};
}