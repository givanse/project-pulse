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
  @tracked projectName:string;
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
      if (history.state) {
        this.projectName = null;
        this.projectNames = history.state.projectNames;
      }
    };

    this._initNavigation();
  }

  _initNavigation() {
    const state = navigation.replaceStateWithQs();
    if (state) {
      this.projectNames = state.projectNames;
    } else {
      this.projectName = navigation.replaceStateWithPath();
    }
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
    this.projectNames = navigation.addProjectName(projectName);
  }

  removeProject(projectName:string) {
    navigation.removeProjectName(projectName);
    const r = cloneAndRemoveString(projectName, this.projectNames);
    this.projectNames = r;
  }

  transitionToP(projectName) {
    this.projectName = navigation.transitionTo(`p/${projectName}`);    
  }

  goBack() {
    history.back();
  }

}