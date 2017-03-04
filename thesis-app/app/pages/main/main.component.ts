/**
 * Created by Lenka on 27/01/2017.
 */
import { Component, OnInit } from "@angular/core";

import {Page} from "ui/page";
import {Router} from "@angular/router";

@Component ({
    selector: "main",
    templateUrl: "pages/main/main.html",
    styleUrls: ["pages/main/main-common.css", "pages/main/main.css"]
})

export class MainComponent implements OnInit{

    constructor(private router: Router, private page: Page){
    }

    ngOnInit() {
        this.page.actionBarHidden = false;
    }

    signUp() {
        this.router.navigate(['signUp']);
    }

    login() {
        this.router.navigate(['login']);
    }

}