
function aggregateRepoData(repo, aggregates) {
  if (repo.isFork) { // only non-forks contribute
    return;
  }

  aggregates.forkCount += repo.forkCount;
  aggregates.commits +=  repo.master.commits.history.totalCount;
  aggregates.prsOpen +=  repo.prsOpen.totalCount;
  aggregates.prsClosed +=  repo.prsClosed.totalCount;
  aggregates.issuesOpen +=  repo.issuesOpen.totalCount;
  aggregates.issuesClosed +=  repo.issuesClosed.totalCount;
}

module.exports = function addAggregates(data) {

  const keys = Object.keys(data);
  delete keys.id;

  const aggregates = {
    forkCount: 0,
    commits: 0,
    prsOpen: 0,
    prsClosed: 0,
    issuesOpen: 0,
    issuesClosed: 0,
  };

  for (const key of keys) {
    if (/^repo/.test(key)) {
      const repo = data[key];
      aggregateRepoData(repo, aggregates);
    } else if (/^org/.test(key)) {
      const repos = data[key].repositories.nodes;
      for (const repo of repos) {
        aggregateRepoData(repo, aggregates);
      }
    } else {
      throw new Error('Found a key that is not a repo or and org');
    }
  }

  return aggregates;
}