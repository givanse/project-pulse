import Component, { tracked } from '@glimmer/component';
import qs from '../../../utils/qs';
import names from '../../../utils/names';

export default class ProjectPulse extends Component {

  @tracked invalidName: string;

  didInsertElement() {
    //const input = this.bounds.firstNode.querySelector('.ui.search');
    const input = $('.ui.search');
    input
    .search({
      source: names 
    });
  }

  get projectNames() {
    return qs.projectNames();
  }

  addProject(event) {
    const name = event.target.value.trim();

    let validName = false;
    for (const obj of names) {
      if (obj.title === name) {
        validName = true;
        break;
      }
    }

    if (validName) {
      this.invalidName = undefined;
      qs.addProjectName(name);
    } else {
      this.invalidName = name;
    }

    event.target.value = '';
  }

}