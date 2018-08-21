
function aggregateRepoData(repo, aggregates) {
  if (repo.isFork) { // only non-forks contribute
    return;
  }

  aggregates.forkCount += repo.forkCount;
  aggregates.prsOpen +=  repo.prsOpen.totalCount;
  aggregates.prsClosed +=  repo.prsClosed.totalCount;
  aggregates.issuesOpen +=  repo.issuesOpen.totalCount;
  aggregates.issuesClosed +=  repo.issuesClosed.totalCount;

  //TODO: maybe its fine to always assume `master`
  //      and the few edge cases might not have a meaningful impact
  if (repo.master) {
    aggregates.commits +=  repo.master.commits.history.totalCount;
  }
}

module.exports = function addAggregates(data) {

  const aggregates = {
    forkCount: 0,
    commits: 0,
    prsOpen: 0,
    prsClosed: 0,
    issuesOpen: 0,
    issuesClosed: 0,
  };

  for (const repo of data.repos) {
    aggregateRepoData(repo, aggregates);
  }

  return aggregates;
}