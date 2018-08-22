
const BASE = window.location.origin;

function fetchjson(url) {
  return fetch(url, {
    headers: {
      Accept: 'application/json',
    }
  })
  .then(function(response) {
    return response.json();
  })
  .catch(function(error) {
    //console.log(error);
    return error;
  });
}

export default function(projectName) {
  return fetchjson(`${BASE}/projects/${projectName}.json`);
}