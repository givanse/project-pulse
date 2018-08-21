const {
  GraphQLClient
} = require('graphql-request');
const token = require('../.github.token') ||
              process.env.TOKEN;

const API_URL = 'https://api.github.com/graphql';

const client = new GraphQLClient(API_URL, {
  headers: {
    Authorization: 'Bearer ' + token,
  }
});

const fragments = `
fragment orgRepos on Organization {
  repositories(last: 100, orderBy:{direction:ASC,field:UPDATED_AT}) {
    nodes {
      ...repoPulse
    }
  }
}

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
  }
}`;
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

module.exports = function(query) {
  query += fragments;

  return client.request(query)
  .catch(function(err) {
    // GraphQL response errors
    console.log(err.response.errors);
    if (err.response.data) console.log(err.response.data);
    process.exit(1);
  });
}
