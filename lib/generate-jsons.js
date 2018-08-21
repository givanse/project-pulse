const fetchProjectData = require('./fetch-project-data');
const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');

const DESCRIPTORS = path.join(__dirname, '..', 'descriptors');
const PROJECTS = path.join(__dirname, '..', 'public', 'projects');
mkdirp(PROJECTS);

async function getDescriptorJson(fileName) {
  try {
    let filePath = path.join(DESCRIPTORS, fileName);  
    const rawdata = await fs.readFile(filePath);  
    const json = JSON.parse(rawdata);  
    return json;
  } catch(err) {
    console.log(err);
  }
}

async function generateProjectJson(fileName) {
  const descriptor = await getDescriptorJson(fileName);

  const projectJson = await fetchProjectData(descriptor); 

  const projectName = path.parse(fileName).name;
  projectJson['id'] = projectName;

  const filePath = path.join(PROJECTS, fileName);  
  console.log(filePath);

  //const txt = JSON.stringify(projectJson);
  const txt = JSON.stringify(projectJson, null, 2);
  fs.writeFile(filePath, txt);
}

fs.readdir(DESCRIPTORS, (err, files) => {
  for (const fileName of files) {
    generateProjectJson(fileName);
  }
});
//generateProjectJson('pivx.json');