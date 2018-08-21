const githubGraphql = require('./github-graphql');
const getAggregateValues = require('./get-aggregate-values');
const normalizeData = require('./normalize-data');

const queryStart = `
query ProjectPulse {
`;
const queryEnd = `
}
`;

//TODO: https://platform.github.community/t/list-repositories-filtered-by-owner-and-repo-name/3172/3?u=givanse
function buildQuery(descriptorJson) {
  let query = '' + queryStart;

  let count = 0;
  for (const orgName of descriptorJson.organizations) {
    query += `
    org${count++}: organization(login: "${orgName}") {
      ...orgRepos
    },`; // trailing comma
  }

  for (const {owner, repo} of descriptorJson.repositories) {
    query += `
    repo${count++}: repository(owner: "${owner}", name: "${repo}") {
      ...repoPulse
    },`; // trailing comma
  }

  query = query.slice(0, -1); // remove trailing comma

  query += queryEnd;

  return query;
}

module.exports = async function (descriptorJson) {
  const query = buildQuery(descriptorJson);
  let data = await githubGraphql(query);

  data = normalizeData(data);

  const aggregates = getAggregateValues(data);
  Object.assign(data, aggregates);

  return data;
}