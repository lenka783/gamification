/**
 * Created by Lenka on 27/01/2017.
 */
import { Component, OnInit } from "@angular/core";

import { Page } from "ui/page";
import { RouterExtensions } from "nativescript-angular/router";

@Component ({
    selector: "main",
    templateUrl: "pages/main/main.html",
    styleUrls: ["pages/main/main-common.css", "pages/main/main.css"]
})

export class MainComponent implements OnInit{

    constructor(private _routerExtensions: RouterExtensions, private _page: Page){
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
    }

    signUp() {
        this._routerExtensions.navigate(['signUp']);
    }

    login() {
        this._routerExtensions.navigate(['login']);
    }

}