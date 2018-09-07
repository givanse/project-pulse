import hbs from '@glimmer/inline-precompile';
import { setupRenderingTest } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: ProjectPulse', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await this.render(hbs`<ProjectPulse />`);
    const txt: string = this.containerElement.textContent;
    assert.ok(txt.includes('Cryptocurrency Project Pulse'));
  });
});
