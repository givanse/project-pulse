export default function formatRepoName(params) {
  const repoName: string = params[0];
  if (!repoName) {
    return 'empty name';
  }

  const [owner, name] = repoName.split('/');
  return `${owner} / ${name}`;
}
