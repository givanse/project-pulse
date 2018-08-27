import Component, {tracked} from '@glimmer/component';
import fetchProject from '../../../utils/fetch-project';

export default class ProjectPanel extends Component {

  @tracked project:any = null;

  @tracked sortKey = 'forkCount';

  constructor(options) {
    super(options);
    this.fetchProject(this.args.projectName);
  }

  async fetchProject(projectName:string):Promise<void> {
    this.project = await fetchProject(projectName);
  }

/*
  @tracked('project', 'sortKey')
  get reposSorted() {
    if (!this.project) return [];

    return this.project.repos.sort(function(a, b) {
      return b.forkCount - a.forkCount;
    });
  }
  */

}
