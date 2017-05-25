/**e
 * Created by Lenka on 27/01/2017.
 */
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";
import { Label } from "ui/label";
import { Button } from "ui/button";
import { DatePicker } from "ui/date-picker";
import { TextField } from "ui/text-field";

import dialogs = require("ui/dialogs");

import {
    Account,
    AccountApi,
    LoopBackConfig,
    Config,
    hasValidEmail
} from "../../shared";

@Component({
    selector: "signUp",
    templateUrl: "pages/signUp/signUp.html",
    providers: [AccountApi],
    styleUrls: ["pages/signUp/signUp-common.css", "pages/signUp/signUp.css"]
})

export class SignUpComponent implements OnInit, OnDestroy {

    private account: Account = new Account();
    private datePickerIsVisible: boolean;

    @ViewChild("container") container: ElementRef;
    @ViewChild("firstName") firstName: ElementRef;
    @ViewChild("lastName") lastName: ElementRef;
    @ViewChild("datePicker") datePicker: ElementRef;
    @ViewChild("dateLabel") dateLabel: ElementRef;
    @ViewChild("dateButton") dateButton: ElementRef;
    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;
    @ViewChild("passwordValidation") passwordValidation: ElementRef;
    @ViewChild("submitButton") submitButton: ElementRef;

    constructor(private _router: Router, private _page: Page, private _account: AccountApi) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);

    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.datePickerIsVisible = false;
    }

    ngOnDestroy() {
        this._router.navigate(['MainComponent']);
    }

    dateButtonTap() {
        let datePicker = <DatePicker>this.datePicker.nativeElement;
        let dateLabel = <Label>this.dateLabel.nativeElement;
        let dateButton = <Button>this.dateButton.nativeElement;

        datePicker.visibility = this.datePickerIsVisible ? "collapse" : "visible";
        dateLabel.visibility = this.datePickerIsVisible ? "visible" : "collapse";
        dateButton.text = dateButton.text = this.datePickerIsVisible ? "Choose date" : "Submit date";

        console.log("Account's date of birth: " + this.account.dateOfBirth);

        this.datePickerIsVisible = !this.datePickerIsVisible;
    }

    register() {
        var accounts = this._account.find(account => {
            account.email == this.account.email;
        })
        if (accounts.isEmpty) {
            if (this.passwordIsConfirmed()) {
                this._account.create(this.account).subscribe(
                    result => {
                        this._account.login(this.account).subscribe(
                            result => this._router.navigate(['profile']),
                            error => {
                                console.log("Problem occured while connecting to server");
                                dialogs.alert({
                                    title: "Server connection failed",
                                    message: "Could not connect to the server, try again later.",
                                    okButtonText: "Ok"
                                });
                            });
                    },
                    error => this.registerErrorHandler());
            } else {
                alert("Passwords must match!");
            }
        } else {
            alert("There already is an account for given email.");
        }


    }

    private registerErrorHandler() {
        if (!this.isCompletelyFilled()) {
            dialogs.alert({
                title: "Form not filled",
                message: "Please fill out the form completely!",
                okButtonText: "Ok"
            });
            return;
        }
        if (!hasValidEmail(this.account)) {
            dialogs.alert({
                title: "Invalid email",
                message: "Write a proper email address.",
                okButtonText: "Ok"
            });
            return;
        }

        this._account.find({
            where: {
                email: this.account.email
            }
        }).subscribe(
            res => {
                if (res.length != 0) {
                    console.log("Account for given email already exists!");
                    dialogs.alert({
                        title: "Email already exists!",
                        message: "Account for given email already exists, choose another email.",
                        okButtonText: "Ok"
                    });
                }
            },
            err => {
                console.log("Problem occured while connecting to server");
                    dialogs.alert({
                        title: "Server connection failed",
                        message: "Could not connect to the server, try again later.",
                        okButtonText: "Ok"
                    });
            }
        );
    }

    private passwordIsConfirmed(): Boolean {
        let passwordValidation = <TextField>this.passwordValidation.nativeElement;
        if (this.account.password != passwordValidation.text) {
            return false;
        }
        return true;
    }

    private isCompletelyFilled(): Boolean {
        return this.account.firstName != null
            && this.account.lastName != null
            && this.account.password != null
            && this.account.email != null;
    }
}