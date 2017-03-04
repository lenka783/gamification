/**e
 * Created by Lenka on 27/01/2017.
 */
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Page } from "ui/page";
import { Label } from "ui/label";
import { Button } from "ui/button";
import { DatePicker } from "ui/date-picker";

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

        if (this.datePickerIsVisible) {
            this.account.dateOfBirth = datePicker.date;
        }

        this.datePickerIsVisible = !this.datePickerIsVisible;
    }

    register() {
        var accounts = this._account.find(account => {
            account.email == this.account.email;
        })
        if (accounts.isEmpty) {
            this._account.create(this.account).subscribe(
                result => {
                    this._account.login(this.account).subscribe(
                        result => this._router.navigate(['first']),
                        error => alert("Error occured" + error.message));
                },
                error => this.registerErrorHandler());
        } else {
            alert("There already is an account for given email.");
        }

    }

    private registerErrorHandler() {
        if (!hasValidEmail(this.account)) {
            alert("This is not a valid email address!");
        } else {
            alert("Please fill out the form completely!");
        }
    }
}