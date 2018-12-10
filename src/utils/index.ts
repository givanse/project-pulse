
/**
 * This id is used as a key in the {{each}} loops.
 */
let id: number = 1;

export function buildUniqueProjectDesc(projectName: string): any {
  return {
    id: id++,
    name: projectName,
  };
}
