import {computerFriendly} from './name-helpers';

function replaceStateWithQs():any {
const qs = window.location.search;
  const state = {
    projectNames: getProjectNamesFromQs()
  };
  history.replaceState(state, '', qs);
  return state;
}

function buildQs(projectNames):string {
  projectNames = projectNames.join(',');
  return `?projectNames=${projectNames}`;
}

function addProjectName(projectName:string) {
  projectName = computerFriendly(projectName);

  const currentState = history.state;
  const newState = Object.assign({}, currentState);

  newState.projectNames.push(projectName);
  const qs = buildQs(newState.projectNames);
  history.pushState(newState, '', qs);
}

function getProjectNamesFromQs():string[] {
  const qs = window.location.search;
  const projectNames = qs.substring(qs.indexOf('=')+1).split(',');
  return projectNames;
}

function removeProjectName(target:string) {
  target = computerFriendly(target);

  const currentState = history.state;
  const newState = Object.assign({}, currentState);

  const arr = newState.projectNames;
  for (let i = arr.length-1; i>=0; i--) {
    if (arr[i] === target) {
        arr.splice(i, 1);
    }
  }
 
  const qs = buildQs(newState.projectNames);
  history.pushState(newState, '', qs);
}

export default {
  replaceStateWithQs,
  removeProjectName,
  addProjectName,
  getProjectNamesFromQs,
};