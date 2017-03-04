import { Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";

import { Repository, RepositoryApi, LoopBackConfig, Config} from "../../shared/index"

@Component ({
    selector: "first",
    templateUrl: "pages/first/first.html",
    providers: [ RepositoryApi ],
    styleUrls: ["pages/first/first-common.css", "pages/first/first.css"]
})

export class FirstComponent implements OnInit {
    repositoryList: Array<Repository> = [];

    name: string;
    content: string;

    constructor( private _router: Router, private _page: Page, private _repository: RepositoryApi) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
    }

    ngOnInit (){
        this._page.actionBarHidden = false;
    }

    
}
