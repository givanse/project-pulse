import Component from '@glimmer/component';
import names from '../../../utils/names';

export default class ProjectSearchBar extends Component {

  public didInsertElement() {
    const firstNode = this.bounds.firstNode;
    this.populateSearchInput(firstNode);
  }

  private populateSearchInput(node: Node) {
    const $ = window.$ || (() => ({search: () => null}));
    $(node)
    .search({
      source: names
    });
  }

}
