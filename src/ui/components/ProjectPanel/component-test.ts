import hbs from '@glimmer/inline-precompile';
import { render, setupRenderingTest } from '@glimmer/test-helpers';

const { module, test } = QUnit;

module('Component: ProjectPanel', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(0);
    this.desc = {id: 1, name: 'bitcoin'};
    this.removeProject = () => null;
    await render(hbs`<ProjectPanel @projectDesc={{this.desc}} @removeProject={{this.removeProject}} />`);
    const result = this.containerElement.innerText.trim();
    // assert.equal(result, '');
  });
});
