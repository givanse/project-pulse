import {computerFriendly} from './name-helpers';
import {buildUniqueProjectDesc} from './index';

function replaceStateWithQs():any {
const qs = window.location.search;
  const state = {
    projectNames: getProjectNamesFromQs()
  };
  history.replaceState(state, '', qs);
  return state;
}

function buildQs(projectNames:any[]):string {
  let qs = '?projectNames=';
  for (const obj of projectNames) {
    qs += `${obj.name},`;
  }
  qs = qs.substr(0, qs.lastIndexOf(','));
  return qs;
}

function addProjectName(projectName:string) {
  projectName = computerFriendly(projectName);

  const currentState = history.state;
  const newState = Object.assign({}, currentState);

  const projDesc = buildUniqueProjectDesc(projectName);
  newState.projectNames.push(projDesc);
  const qs = buildQs(newState.projectNames);
  history.pushState(newState, '', qs);

  return newState.projectNames; 
}

function getProjectNamesFromQs():object[] {
  const qs = window.location.search;
  const projectNames = qs.substring(qs.indexOf('=')+1).split(',');
  
  const arr = [];
  for (const name of projectNames) {
    const projDesc = buildUniqueProjectDesc(name);
    arr.push(projDesc);
  }
  return arr;
}

function removeProjectName(target:string) {
  target = computerFriendly(target);

  const currentState = history.state;
  const newState = Object.assign({}, currentState);

  const arr = newState.projectNames;
  for (let i = arr.length-1; i>=0; i--) {
    const name = arr[i].name;
    if (name === target) {
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