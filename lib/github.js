const fetch = require('node-fetch');
const token = require('../.github.token');

const BASE = 'https://api.github.com';

async function fetchjson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
      //'Content-Type': 'application-json',
      //'User-Agent': 'Github-Project-Pulse',
    }
  });

  return response.json();
}

module.exports = {
  orgs(org, resource) {
    return fetchjson(`${BASE}/orgs/${org}/${resource}`);
  },

  repo(org, repo) {
    return fetchjson(`${BASE}/repos/${org}/${repo}`);
  },

  allIssues(owner, repo) {
    return fetchjson(`${BASE}/repos/${owner}/${repo}/issues?state=all`);
  },

  repoTopics(owner, repo) {
    return fetchjson(`${BASE}/repos/${owner}/${repo}/topics`);
  },

  contributors(owner, repo) {
    return fetchjson(`${BASE}/repos/${owner}/${repo}/contributors?anon=true`);
  },
}

