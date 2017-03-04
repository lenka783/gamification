import { Component, OnInit, ElementRef, ViewChild} from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { Color } from "color";

import { 
    Account, 
    AccountApi,
    LoopBackConfig,
    Config
} from "../../shared";


import { ObservableArray } from 'data/observable-array';

@Component ({
    selector: "login",
    providers: [ AccountApi ],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})

export class LoginComponent implements OnInit {
    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;

    private account: Account = new Account();

    constructor( 
        private _account: AccountApi, 
        private _router: Router, 
        private _page: Page) {
            LoopBackConfig.setBaseURL(Config.BASE_URL);
            LoopBackConfig.setApiVersion(Config.API_VERSION);
            if (this._account.isAuthenticated())
                this._router.navigate(['first']);
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
    }

    login() {
        this._account.login(this.account)
        .subscribe(res => this._router.navigate(['first']), err => alert(err));
        
    }

}