/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface RepositoryInterface {
  projectName: string;
  gitAddress: string;
  id?: any;
  contributors?: Account[];
}

export class Repository implements RepositoryInterface {
  projectName: string;
  gitAddress: string;
  id: any;
  contributors: Account[];
  constructor(data?: RepositoryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Repository`.
   */
  public static getModelName() {
    return "Repository";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Repository for dynamic purposes.
  **/
  public static factory(data: RepositoryInterface): Repository{
    return new Repository(data);
  }  
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Repository',
      plural: 'Repositories',
      properties: {
        projectName: {
          name: 'projectName',
          type: 'string'
        },
        gitAddress: {
          name: 'gitAddress',
          type: 'string'
        },
        id: {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
        contributors: {
          name: 'contributors',
          type: 'Account[]',
          model: 'Account'
        },
      }
    }
  }
}
