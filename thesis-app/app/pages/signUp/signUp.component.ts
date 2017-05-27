/**e
 * Created by Lenka on 27/01/2017.
 */
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";

import { Page } from "ui/page";
import { Label } from "ui/label";
import { Button } from "ui/button";
import { DatePicker } from "ui/date-picker";
import { TextField } from "ui/text-field";

import { DatePickerModalViewComponent, Dialogs } from "../../shared/modalViews/index";

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
    private dialogs: Dialogs;

    @ViewChild("container") container: ElementRef;
    @ViewChild("firstName") firstName: ElementRef;
    @ViewChild("lastName") lastName: ElementRef;
    @ViewChild("dateLabel") dateLabel: ElementRef;
    @ViewChild("dateButton") dateButton: ElementRef;
    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;
    @ViewChild("passwordValidation") passwordValidation: ElementRef;
    @ViewChild("submitButton") submitButton: ElementRef;

    constructor(private _router: Router, private _page: Page, private _account: AccountApi,
        private _modalService: ModalDialogService, private vcRef: ViewContainerRef) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.dialogs = new Dialogs(_modalService, vcRef);
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
    }

    ngOnDestroy() {
        this._router.navigate(['MainComponent']);
    }

    dateButtonTap() {
        let dateLabel = <Label>this.dateLabel.nativeElement;
        let dateButton = <Button>this.dateButton.nativeElement;
        let that = this;
        let currentDate = new Date();
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: currentDate.toDateString(),
            fullscreen: false
        };

        this._modalService.showModal(DatePickerModalViewComponent, options)
            .then((dateresult: Date) => {
                this.account.dateOfBirth = dateresult;
            });
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
                                this.dialogs.alert("Server connection failed", "Could not connect to the server, try again later.", "Ok");
                            });
                    },
                    error => this.registerErrorHandler());
            } else {
                this.dialogs.alert("Error", "Passwords must match!", "Ok");
            }
        } else {
            this.dialogs.alert("Error", "There already is an account for given email.", "Ok");
        }


    }

    private registerErrorHandler() {
        if (!this.isCompletelyFilled()) {
            this.dialogs.alert("Form not filled", "Please fill out the form completely!", "Ok");
            return;
        }
        if (!hasValidEmail(this.account)) {
            this.dialogs.alert("Invalid email", "Write a proper email address.", "Ok");
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
                    this.dialogs.alert("Email already exists!", "Account for given email already exists, choose another email.", "Ok");
                }
            },
            err => {
                console.log("Problem occured while connecting to server");
                this.dialogs.alert("Server connection failed", "Could not connect to the server, try again later.", "Ok");
            });
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