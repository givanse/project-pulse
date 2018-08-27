
let _id = 1;

export function buildUniqueProjectDesc(projectName:string):any {
  return {
    id: _id++,
    name: projectName
  };
}

export function cloneAndRemoveString(target:string, arr:any[]):string[] {
  const newArr = [];
  for (let i = 0; i<arr.length;i++) {
    const strB = arr[i].name;
    if (strB !== target) {
      const obj = buildUniqueProjectDesc(strB);
      newArr.push(obj);
    }
  }
  return newArr;
}