
function addProjectName(projectName) {
  window.location.search += `,${projectName}`;
}

function projectNames() {
  const qs = window.location.search;
  const projectNames = qs.substring(qs.indexOf('=')+1).split(',');
  return projectNames;
}

function removeProjectName(projectName) {
  const names = projectNames();

  let qs = '?projects=';
  for (const name of names) {
    if (name === projectName) {
      continue;
    } else {
      qs += name + ',';    
    }
  }
  qs = qs.substr(0, qs.length - 1);
  
  window.location.search = qs;
}

export default {
  projectNames,
  removeProjectName,
  addProjectName,
};