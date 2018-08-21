import Component from '@glimmer/component';

export default class ProjectPulse extends Component {

  get projectNames() {
    let qs = window.location.search;
    const projectNames = qs.substring(qs.indexOf('=')+1).split(',');
    return projectNames;
  }

}
