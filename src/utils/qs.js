
function addProjectName(projectName) {
  window.location.search += `,${projectName}`;
}

function projectNames() {
  const qs = window.location.search;
  const projectNames = qs.substring(qs.indexOf('=')+1).split(',');
  return projectNames;
}

function removeProjectName(projectName) {
  let qs = window.location.search;
  qs = qs.replace(`,${projectName}`, '');
  window.location.search = qs;
}

export default {
  projectNames,
  removeProjectName,
  addProjectName,
};