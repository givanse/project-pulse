import Component, { tracked } from '@glimmer/component';
import navigation from '../../../utils/navigation';
import names from '../../../utils/names';
import {humanFriendly, computerFriendly} from '../../../utils/name-helpers';
//import {cloneAndRemoveString} from '../../../utils';
import Navigo from 'navigo';

for (const obj of names) {
  obj.title = humanFriendly(obj.title);
}

export default class ProjectPulse extends Component {

  router;
  @tracked invalidName: string;
  @tracked projectId:string;
  @tracked projectNames:any[];
  @tracked('projectNames') get projectNamesHuman():string[] {
    const arr = [];
    for (const projDesc of this.projectNames) {
      const name = humanFriendly(projDesc.name);
      arr.push(name);
    }
    return arr;
  }
  @tracked('projectNames') get projectNamesQs():string {
    let str = '';
    for (let i = 0; i<this.projectNames.length; i++) {
      const name = this.projectNames[i].name;
      if (i === 0) {
        str += name; 
      } else {
        str += ',' + name; 
      }
    }
    return '/?projectNames=' + str;
  }

  constructor(options) {
    super(options);

    window.onpopstate = (/*event*/) => {
      console.log('popstate', history.state);
    };

    this._initNavigation();
  }

  _initNavigation() {
    const useHash = false;
    this.router = new Navigo(location.origin, useHash);
    this.router.on('/', () => {
      this.projectNames = navigation.getProjectNamesFromQs();
    })
    .on('/p/:projectId', params => { this.projectId = params.projectId; })
    .resolve();
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

  _addProject(projectName:string):void {
    projectName = computerFriendly(projectName);
    const qs = window.location.search + `,${projectName}`;
    this.router.navigate(`/${qs}`);
  }

  removeProject(projectName:string) {
    const qs = navigation.removeProjectName(projectName);
    this.router.navigate(`/${qs}`);
  }

}