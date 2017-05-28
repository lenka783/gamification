import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router"; 

import { LoopBackConfig, AccountApi } from "./shared/sdk";
import frameModule = require("ui/frame");

@Component({
    selector: "my-app",
    template: "<page-router-outlet></page-router-outlet>",
    providers: [ AccountApi ],
})
export class AppComponent {
    constructor(private _routerExtensions: RouterExtensions, private _account: AccountApi) {
        if (!this._account.isAuthenticated()) {
            this._routerExtensions.navigate(['MainComponent']);
        } else {
            this._routerExtensions.navigate(["profile"])
        }
    }
}