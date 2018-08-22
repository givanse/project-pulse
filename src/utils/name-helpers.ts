export function humanFriendly(projectName: string) {
  return projectName.replace('-', ' ');
}

export function computerFriendly(projectName: string) {
  return projectName.replace(' ', '-');
}