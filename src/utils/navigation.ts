import {computerFriendly} from './name-helpers';
import {buildUniqueProjectDesc} from './index';

function replaceStateWithQs():any {
  const qs = window.location.search;

  if (!qs) {
    return null;
  }

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

function getProjectNamesFromQs():any[] {
  const qs = window.location.search;
  if (!qs) {
    return [];
  }

  const projectNames = qs.substring(qs.indexOf('=')+1).split(',');
  
  const arr = [];
  for (const name of projectNames) {
    const projDesc = buildUniqueProjectDesc(name);
    arr.push(projDesc);
  }
  return arr;
}

function removeProjectName(target:string):string {
  target = computerFriendly(target);

  const projectNames = getProjectNamesFromQs();
  const arr = projectNames;

  for (let i = arr.length-1; i>=0; i--) {
    const name = arr[i].name;
    if (name === target) {
        arr.splice(i, 1);
    }
  }
 
  const qs = buildQs(arr);
  return qs;
}

export default {
  removeProjectName,
  getProjectNamesFromQs,
};