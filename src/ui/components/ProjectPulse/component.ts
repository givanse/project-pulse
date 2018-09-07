import Component, { tracked } from '@glimmer/component';
import Navigo from 'navigo';
import {
  computerFriendly,
  humanFriendly,
} from '../../../utils/name-helpers';
import names from '../../../utils/names';
import navigation from '../../../utils/navigation';

for (const obj of names) {
  obj.title = humanFriendly(obj.title);
}

export default class ProjectPulse extends Component {

  private router;
  @tracked private invalidName: string;
  @tracked private projectId: string;
  @tracked private projectNames: any[];

  @tracked('projectNames') get projectNamesHuman(): string[] {
    const arr = [];
    if (!this.projectNames) {
      if (this.projectId) {
        return [humanFriendly(this.projectId)];
      }

      return arr;
    }

    for (const projDesc of this.projectNames) {
      const name = humanFriendly(projDesc.name);
      arr.push(name);
    }
    return arr;
  }

  @tracked('projectNames') get projectNamesQs(): string {
    let str = '';
    if (!this.projectNames) {
      if (this.projectId) {
        return '?projectNames=' + this.projectId;
      }

      return str;
    }

    for (let i = 0; i < this.projectNames.length; i++) {
      const name = this.projectNames[i].name;
      if (i === 0) {
        str += name;
      } else {
        str += ',' + name;
      }
    }
    return '?projectNames=' + str;
  }

  constructor(options) {
    super(options);
    this.initNavigation();
  }

  public removeProject(projectName: string) {
    const qs = navigation.removeProjectName(projectName);
    this.router.navigate(`/${qs}`);
  }

  public addProject(event) {
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

  public didInsertElement() {
    const firstNode = this.bounds.firstNode;
    this.populateSearchInput(firstNode);
  }

  public didUpdate() {
    this.router.updatePageLinks();
  }

  private initNavigation() {
    const useHash = false;
    this.router = new Navigo(location.origin, useHash);

    this.router.on('/', () => {
      this.projectNames = navigation.getProjectNamesFromQs();
      this.projectId = null;
    })
    .on('/p/:projectId', (params) => { this.projectId = params.projectId; })
    .resolve();

    this.router.notFound(function() {
      this.status.c404 = true;
    });
  }

  private populateSearchInput(node: Node) {
    const $ = window.$ || (() => ({search: () => null}));
    $(node)
    .search({
      source: names
    });
  }

  private _addProject(projectName: string): void {
    projectName = computerFriendly(projectName);
    let qs;
    if (window.location.search) {
      qs = window.location.search + `,${projectName}`;
    } else {
      qs = `?projectNames=${projectName}`;
    }
    this.router.navigate(`/${qs}`);
  }

}
