import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";

import { LoopBackConfig, AccountApi } from "./shared/sdk";

@Component({
    selector: "my-app",
    template: "<page-router-outlet></page-router-outlet>",
    providers: [ AccountApi ],
})
export class AppComponent {
    constructor(private _router: Router, private _account: AccountApi) {
        if (!this._account.isAuthenticated()) {
            this._router.navigate(['MainComponent']);
        }
    }
}