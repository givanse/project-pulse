import {buildUniqueProjectDesc} from './index';

// TODO: copy pasta from ProjectPulse
interface ProjectDesc {
  id: number;
  name: string;
}

function pushStateAddProjectName(projectName: string): any {
  const state = {
    path: '',
    projectDescs: getProjectNamesFromQueryString(),
  };

  const projectDesc = buildUniqueProjectDesc(projectName);
  state.projectDescs.push(projectDesc);

  const queryString = window.location.search;
  const lastChar = queryString.charAt(queryString.length - 1);
  const comma = lastChar === '=' ? '' :  ',';
  state.path = queryString + comma + projectName;
  window.history.pushState(state, null, state.path);

  return projectDesc;
}

function pushStateRemoveProjectName(projectDescs: ProjectDesc[]): void {
  const state = {
    path: '',
    projectDescs,
  };

  const queryString = buildQs(projectDescs);
  state.path = queryString;

  window.history.pushState(state, null, state.path);
}

function buildQs(projectDescs: ProjectDesc[]): string {
  let qs = '?projectNames=';

  if (!projectDescs.length) {
    return qs;
  }

  for (const obj of projectDescs) {
    qs += `${obj.name},`;
  }

  qs = qs.substr(0, qs.lastIndexOf(',')); // remove last comma

  return qs;
}

function getProjectNamesFromQueryString(): ProjectDesc[] {
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

export default {
  getProjectNamesFromQueryString,
  pushStateAddProjectName,
  pushStateRemoveProjectName,
};
