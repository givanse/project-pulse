import {computerFriendly} from './name-helpers';

const BASE = window.location.origin;

function fetchjson(url:string) {
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

export default function(projectName:string) {
  projectName = computerFriendly(projectName); 
  return fetchjson(`${BASE}/projects/${projectName}.json`);
}