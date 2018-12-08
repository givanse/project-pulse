import {buildUniqueProjectDesc} from './index';
import {computerFriendly} from './name-helpers';

function pushStateWithQueryString(projectName: string): any {
  const state = {
    projectNames: getProjectNamesFromQueryString(),
    path: '',
  };

  const projectDesc = buildUniqueProjectDesc(projectName);
  state.projectNames.push(projectDesc);
  //state.projectNames.push(projectName);

  const queryString = window.location.search;
  state.path = queryString + ',' + projectName;
  window.history.pushState(state, null, state.path);

  return projectDesc;
}

function buildQs(projectNames: any[]): string {
  let qs = '?projectNames=';
  for (const obj of projectNames) {
    qs += `${obj.name},`;
  }
  qs = qs.substr(0, qs.lastIndexOf(','));
  return qs;
}

function getProjectNamesFromQueryString(): any[] {
  const qs = window.location.search;
  if (!qs) {
    return [];
  }

  const projectNames = qs.substring(qs.indexOf('=') + 1).split(',');

  const arr = [];
  for (const name of projectNames) {
    const projDesc = buildUniqueProjectDesc(name);
    arr.push(projDesc);
  }

  return arr;
}

function removeProjectName(target: string): string {
  target = computerFriendly(target);

  const projectNames = getProjectNamesFromQueryString();
  const arr = projectNames;

  for (let i = arr.length - 1; i >= 0; i--) {
    const name = arr[i].name;
    if (name === target) {
        arr.splice(i, 1);
    }
  }

  const qs = buildQs(arr);
  return qs;
}

export default {
  getProjectNamesFromQueryString,
  removeProjectName,
  pushStateWithQueryString,
};
