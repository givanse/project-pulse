export default function formatRepoName(params) {
  const [owner, name] = params[0].split('/');
  return `${owner} / ${name}`;
}
