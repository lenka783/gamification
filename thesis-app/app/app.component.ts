import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";

import { LoopBackConfig, AccountApi } from "./shared/sdk";
import frameModule = require("ui/frame");

@Component({
    selector: "my-app",
    template: "<page-router-outlet></page-router-outlet>",
    providers: [ AccountApi ],
})
export class AppComponent {
    constructor(private _router: Router, private _account: AccountApi) {
        //frameModule.Frame.defaultTransition = { name: "slide" };
        if (!this._account.isAuthenticated()) {
            this._router.navigate(['MainComponent']);
        } else {
            this._router.navigate(["profile"])
        }
    }
}