import hbs from '@glimmer/inline-precompile';
import { render, setupRenderingTest } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: ProjectSummary', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.project = {name: 'foobar'};
    this.removeProject = () => null;
    await render(hbs`<ProjectSummary @project={{this.project}}
                    @close={{action this.removeProject}} />`);
    const result = this.containerElement.querySelector('.header').innerText.trim();
    assert.equal(result, 'foobar');
  });
});
