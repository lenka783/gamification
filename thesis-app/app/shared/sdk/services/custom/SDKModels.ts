/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Account } from '../../models/Account';
import { Repository } from '../../models/Repository';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Account: Account,
    Repository: Repository,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
