
/**
 * This id is used as a key in the {{each}} loops.
 */
let id: number = 1;

export function buildUniqueProjectDesc(projectName: string): any {
  return {
    id: id++, //TODO: what is this ID for? to allow dupes?
    name: projectName,
  };
}
