
let id = 1;

export function buildUniqueProjectDesc(projectName: string): any {
  return {
    id: id++,
    name: projectName
  };
}
