import Component from '@glimmer/component';
import qs from '../../../utils/qs';
import { ENTER } from '../../../utils/keys';

export default class ProjectPulse extends Component {

  get projectNames() {
    return qs.projectNames();
  }

  addProject(event) {
    if (event.which !== ENTER) {
      return;
    }

    const value = event.target.value.trim();

    if (value.length > 0) {
      qs.addProjectName(value);
    }

    event.target.value = '';
  }

}