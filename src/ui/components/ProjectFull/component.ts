import Component, {tracked} from '@glimmer/component';
import fetchProject from '../../../utils/fetch-project';
import { humanFriendly } from '../../../utils/name-helpers';

export default class ProjectFull extends Component {

  @tracked project:any = null;

  constructor(options) {
    super(options);

    if (this.args.project) {
      this.project = this.args.project;
    } else if (this.args.projectId) {
      const projectId = this.args.projectId;
      this.fetchProject(projectId);
    }
  }

  async fetchProject(projectName:string):Promise<void> {
    this.project = await fetchProject(projectName);
    this.project.name = humanFriendly(this.project.id);
  }

}