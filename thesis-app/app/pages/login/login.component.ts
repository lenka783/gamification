import { Component, OnInit, ElementRef, ViewChild} from "@angular/core";
import { ViewContainerRef} from "@angular/core";
import { Router } from "@angular/router";

import { ModalDialogService } from "nativescript-angular/modal-dialog"

import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { ActivityIndicator } from "ui/activity-indicator";
import { Color } from "color";

import { LoopBackConfig, Config } from "../../shared";
import { AccountApi } from "../../shared/sdk/services";
import { Account, AccessToken } from "../../shared/sdk/models";
import { Dialogs } from "../../shared/modalViews/index";

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
    private isLoading: Boolean;
    private dialogs: Dialogs;

    constructor( 
        private _account: AccountApi, 
        private _router: Router, 
        private _page: Page, 
        private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
            LoopBackConfig.setBaseURL(Config.BASE_URL);
            LoopBackConfig.setApiVersion(Config.API_VERSION);
            if (this._account.isAuthenticated())
                this._router.navigate(['first']);
            this.account.email = "admin@thesis.cz";
            this.account.password = "admin";
            this.dialogs = new Dialogs(_modalService, vcRef)
    }

    ngOnInit() {
        this.isLoading = false;
        this._page.actionBarHidden = false;
        console.log("Current cached account: " + (<Account>this._account.getCachedCurrent()));
        console.log("Account email: " + this.account.email);
    }

    login() {
        this.isLoading = true;
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
                    this.dialogs.alert(
                        "Wrong email!",
                        "No account found for given email, register first!",
                        "Ok");
                } else {
                    console.log("Wrong password");
                    this.dialogs.alert(
                        "Wrong password!",
                        "Please try again with the correct password!",
                        "Ok");
                }
            },
            err => {
                console.log("Problem occured while connecting to server: " + err.message);
                    this.dialogs.alert(
                        "Server connection failed",
                        "Could not connect to the server, try again later.",
                        "Ok");
            }
        );
    }
}