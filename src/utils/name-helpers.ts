export function humanFriendly(projectName: string):string {
  return projectName.replace('-', ' ');
}

export function computerFriendly(projectName: string):string {
  return projectName.replace(' ', '-');
}