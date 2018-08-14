import ipad from './helper';

const { module, test } = QUnit;

module('Helper: ipad', function(hooks) {
  test('it computes', function(assert) {
    assert.equal(ipad([]), undefined);
  });
});
