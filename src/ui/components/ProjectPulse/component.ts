import Component, { tracked } from '@glimmer/component';
import navigation from '../../../utils/navigation';
import names from '../../../utils/names';
import {humanFriendly} from '../../../utils/name-helpers';
import {cloneAndRemoveString} from '../../../utils';

for (const obj of names) {
  obj.title = humanFriendly(obj.title);
}

export default class ProjectPulse extends Component {

  @tracked invalidName: string;

  constructor(options) {
    super(options);

    window.onpopstate = (/*event*/) => {
      this.projectNames = history.state.projectNames;
    };

    const state = navigation.replaceStateWithQs();
    this.projectNames = state.projectNames;
  }

  _populateSearchInput(node:Node) {
    $(node)
    .search({
      source: names 
    });
  }

  didInsertElement() {
    const firstNode = this.bounds.firstNode;
    this._populateSearchInput(firstNode);
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
      this._addProject(name);
    } else {
      this.invalidName = name;
    }

    event.target.value = '';
  }

  @tracked projectNames:any[];

  _addProject(projectName:string):void {
    this.projectNames = navigation.addProjectName(projectName);
  }

  removeProject(projectName:string) {
    navigation.removeProjectName(projectName);
    const r = cloneAndRemoveString(projectName, this.projectNames);
    this.projectNames = r;
  }

  @tracked repos:any[];
  @tracked asideProjectName:string;

  showRepos(projectName, repos) {
    this.asideProjectName = projectName;
    this.repos = repos;
  }

}