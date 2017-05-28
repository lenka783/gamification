/**
 * Created by Lenka on 27/01/2017.
 */
import { Component, OnInit } from "@angular/core";

import { Page } from "ui/page";
import { Router } from "@angular/router";

@Component ({
    selector: "main",
    templateUrl: "pages/main/main.html",
    styleUrls: ["pages/main/main-common.css", "pages/main/main.css"]
})

export class MainComponent implements OnInit{

    constructor(private _router: Router, private _page: Page){
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
    }

    signUp() {
        this._router.navigate(['signUp']);
    }

    login() {
        this._router.navigate(['login']);
    }

}