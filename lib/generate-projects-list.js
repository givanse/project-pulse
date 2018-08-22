const fs = require('fs');
const path = require('path');

const descriptorsPath = path.join(__dirname, '..', 'descriptors');
const namesFilePath = path.join(__dirname, '..', 'src', 'utils', 'names.ts');

function getFileNames() {
  return new Promise(function(resolve) {
    fs.readdir(descriptorsPath, (err, fileNames) => {
      resolve(fileNames);
    });
  });
}

async function buildJSON() {
  const fileNames = await getFileNames();
  const list = [];
  for (const file of fileNames) {
    const name = path.parse(file).name;
    list.push({title: name});
  }
  return JSON.stringify(list);
}

async function writeList() {
  const code = 'export default ' + await buildJSON();

  fs.writeFile(namesFilePath, code, function(err) {
    if(err) {
      return console.log(err);
    }
  }); 
}

writeList();