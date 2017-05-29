import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { ViewContainerRef } from "@angular/core";

import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";

import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import { ActivityIndicator } from "ui/activity-indicator";
import { Color } from "color";

import { LoopBackConfig, Config } from "../../shared";
import { AccountApi } from "../../shared/sdk/services";
import { Account, AccessToken } from "../../shared/sdk/models";
import { Dialogs } from "../../shared/modalViews/index";

import { ObservableArray } from 'data/observable-array';

import { isAndroid } from "platform";
import { AndroidActivityBackPressedEventData, AndroidApplication } from "application";
import application = require("application");

@Component({
    selector: "login",
    providers: [AccountApi],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})

export class LoginComponent implements OnInit, OnDestroy {
    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;

    private account: Account = new Account();
    private isLoading: Boolean;
    private dialogs: Dialogs;

    constructor(
        private _account: AccountApi,
        private _routerExtensions: RouterExtensions,
        private _page: Page,
        private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        if (this._account.isAuthenticated())
            this._routerExtensions.navigate(['profile']);
        this.dialogs = new Dialogs(_modalService, vcRef)
    }

    ngOnInit() {
        this.isLoading = false;
        this._page.actionBarHidden = false;
        //handles the back button pressed from profile page on android
        if (isAndroid) {
            application.android.on(
                AndroidApplication.activityBackPressedEvent,
                (data: AndroidActivityBackPressedEventData) => {
                    if (this._account.isAuthenticated()) {
                        data.cancel = true;
                        this._account.logout();
                        this._routerExtensions.navigate([""]);
                    }
                });
        }
    }

    ngOnDestroy() {
        this.free();
    }

    login() {
        console.log("Login")
        this.isLoading = true;
        this._account.login(this.account)
            .subscribe(
            (res: AccessToken) => {
                console.log("Login OK");
                this._routerExtensions.navigate(['profile']);
                this.isLoading = false;
            },
            err => {
                console.log("ERROR (login) " + err.message);
                this.errorHandler();
            });
    }

    errorHandler() {
        let sub = this._account.find({
            where: {
                email: this.account.email
            }
        }).subscribe(
            res => {
                if (res.length == 0) {
                    this.dialogs.alert(
                        "Wrong email!",
                        "No account found for given email, register first!",
                        "Ok");
                    this.isLoading = false;
                } else {
                    this.dialogs.alert(
                        "Wrong password!",
                        "Please try again with the correct password!",
                        "Ok");
                    this.isLoading = false;
                }},
            err => {
                this.dialogs.alert(
                    "Server connection failed",
                    "Could not connect to the server, try again later.",
                    "Ok");
                this.isLoading = false;},
            () => sub.unsubscribe()
        );
    }

    free() {
        this.account = null;
        this.dialogs = null;
    }
}