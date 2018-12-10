import hbs from '@glimmer/inline-precompile';
import { setupRenderingTest } from '@glimmer/test-helpers';

const { module, test, skip } = QUnit;

module('Component: ProjectPanel', function(hooks) {
  setupRenderingTest(hooks);

  // https://github.com/glimmerjs/glimmer.js/pull/51
  skip('it renders', async function(assert) {
    this.foo = {name: ''};
    await this.render(hbs`<ProjectPanel @projectDesc={{this.foo}} />`);
    assert.ok(this.containerElement.querySelector('div'));
  });
});
