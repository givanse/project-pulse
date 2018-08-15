const {
  GraphQLClient
} = require('graphql-request');
const token = require('../.github.token');

const API_URL = 'https://api.github.com/graphql';

const client = new GraphQLClient(API_URL, {
  headers: {
    Authorization: 'Bearer ' + token,
  }
});

const query = `
query RepoStats($owner: String!, $repo: String!) {
  repo: repository(owner: $owner, name: $repo) {
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
  },
}
`;

function fetchRepoData(owner, repo) {
  const variables = {owner, repo};
  client.request(query, variables)
  .then(data => console.log(data));
}

fetchRepoData('bitcoin', 'bitcoin');
