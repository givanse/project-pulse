import formatRepoName from './helper';

const { module, test } = QUnit;

module('Helper: format-repo-name', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(formatRepoName([]), undefined);
  });
});
