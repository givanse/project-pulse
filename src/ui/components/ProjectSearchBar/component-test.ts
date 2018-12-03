import hbs from '@glimmer/inline-precompile';
import { setupRenderingTest } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: ProjectSearchBar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await this.render(hbs`<ProjectSearchBar />`);
    assert.ok(this.containerElement.querySelector('div'));
  });
});
