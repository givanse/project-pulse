const githubGraphql = require('./github-graphql');
const getAggregateValues = require('./get-aggregate-values');
const normalizeData = require('./normalize-data');

const queryStart = `
query ProjectPulse {
`;
const queryEnd = `
}
`;

const fragmentOrgRepos = `
fragment orgRepos on Organization {
  repositories(last: 100, orderBy:{direction:ASC,field:UPDATED_AT}) {
    nodes {
      ...repoPulse
    }
  }
}
`;

const fragmentRepoPulse = `
fragment repoPulse on Repository {
  nameWithOwner,
  forkCount,
  isFork,
  parent {
    nameWithOwner
  },
  isMirror,
  mirrorUrl,
  createdAt,
  description,
  releases(last: 1, orderBy:{direction:ASC,field:CREATED_AT}) {
    last: nodes {
      name,
      updatedAt
    }
  },
  master: ref(qualifiedName: "master") {
    commits: target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  },
  prsOpen: pullRequests(states:OPEN, last: 100) {
    totalCount
  },
  prsClosed: pullRequests(states:CLOSED, last: 100) {
    totalCount
  },
  issuesOpen: issues(states:OPEN, last: 100) {
    totalCount
  },
  issuesClosed: issues(states:CLOSED, last: 100) {
    totalCount
  },
  stargazers {
    totalCount
  }
}
`;
/* see issue #4
  labels(last:100) {
    nodes {
      name,
      issuesOpen: issues(states:OPEN) {
        totalCount 
      },
      issuesClosed: issues(states:CLOSED) {
        totalCount
      }
    }
  }
}`;*/

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

  query += fragmentRepoPulse;

  if (descriptorJson.organizations.length) {
    query += fragmentOrgRepos;
  }

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