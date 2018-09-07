import Component, {tracked} from '@glimmer/component';
import fetchProject from '../../../utils/fetch-project';
import { humanFriendly } from '../../../utils/name-helpers';

export default class ProjectPanel extends Component {

  @tracked private project: any = null;

  constructor(options) {
    super(options);
    this.fetchProject(this.args.projectName);
  }

  private async fetchProject(projectName: string): Promise<void> {
    this.project = await fetchProject(projectName);
    this.project.name = humanFriendly(this.project.id);
  }

}
