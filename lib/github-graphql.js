const {
  GraphQLClient
} = require('graphql-request');
const token = process.env.TOKEN ||
              require('../.github.token');

const API_URL = 'https://api.github.com/graphql';

const client = new GraphQLClient(API_URL, {
  headers: {
    Authorization: 'Bearer ' + token,
  }
});

module.exports = function(query) {
  return client.request(query)
  .catch(function(err) {
    console.log('Error:');
    console.log(err);
    process.exit(1);
  });
}
