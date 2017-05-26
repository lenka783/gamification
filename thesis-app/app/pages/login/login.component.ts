import { Component, OnInit, ElementRef, ViewChild} from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { Color } from "color";

import { LoopBackConfig, Config } from "../../shared";
import { AccountApi } from "../../shared/sdk/services";
import { Account, AccessToken } from "../../shared/sdk/models";


import { ObservableArray } from 'data/observable-array';
import dialogs = require("ui/dialogs");

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
            this.account.email = "admin@thesis.cz";
            this.account.password = "admin";
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        console.log("Current cached account: " + (<Account>this._account.getCachedCurrent()));
        console.log("Account email: " + this.account.email);
    }

    login() {
        console.log("Accounts creditentials: email={0}, password=$s", this.account.email, this.account.password)
        this._account.login(this.account)
        .subscribe(
            (res: AccessToken) => {
                console.log("loginOK");
                this._router.navigate(['profile']);
            }, 
            err => {
                console.log("ERROR (login) " + err.message);
                this.errorHandler();
            });
    }

    errorHandler() {
        this._account.find({
            where: {
                email: this.account.email
            }
        }).subscribe(
            res => {
                if (res.length == 0) {
                    console.log("No account found for given email!");
                    dialogs.alert({
                        title: "Wrong email!",
                        message: "No account found for given email, register first!",
                        okButtonText: "Ok"
                    });
                } else {
                    console.log("Wrong password");
                    dialogs.alert({
                        title: "Wrong password!",
                        message: "Please try again with the correct password!",
                        okButtonText: "Ok"
                    });
                }
            },
            err => {
                console.log("Problem occured while connecting to server: " + err.message);
                    dialogs.alert({
                        title: "Server connection failed",
                        message: "Could not connect to the server, try again later.",
                        okButtonText: "Ok"
                    });
            }
        );
    }
}