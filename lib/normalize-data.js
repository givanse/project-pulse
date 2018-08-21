module.exports = function(data) {

  const newData = {
    id: data.id,
    repos: [],
  };
  delete data.id;
  const keys = Object.keys(data);

  for (const key of keys) {
    if (/^repo/.test(key)) {
      const repo = data[key];
      newData.repos.push(repo);
    } else if (/^org/.test(key)) {
      const repos = data[key].repositories.nodes;
      for (const repo of repos) {
        newData.repos.push(repo);
      }
    } else {
      throw new Error(`Found a key that is not a repo or and org \`${key}\``);
    }
  }

  return newData;
};