export function humanFriendly(projectName: string): string {
  return projectName.replace(/-/g, ' ');
}

export function computerFriendly(projectName: string): string {
  return projectName.replace(/ /g, '-');
}
