/* tslint:disable */

declare var Object: any;
export interface RepositoryInterface {
  name: string;
  gitCommand: string;
  date: Date;
  content: string;
  id?: any;
}

export class Repository implements RepositoryInterface {
  name: string;
  gitCommand: string;
  date: Date;
  content: string;
  id: any;
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
      plural: 'repositories',
      properties: {
        name: {
          name: 'name',
          type: 'string'
        },
        gitCommand: {
          name: 'gitCommand',
          type: 'string'
        },
        date: {
          name: 'date',
          type: 'Date'
        },
        content: {
          name: 'content',
          type: 'string'
        },
        id: {
          name: 'id',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
