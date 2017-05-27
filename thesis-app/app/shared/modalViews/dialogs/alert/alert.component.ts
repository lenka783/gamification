import { Component, OnInit, NgModule } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { DatePicker } from "ui/date-picker";
import { Page } from "ui/page";

@Component({
    moduleId: module.id,
    templateUrl: "./alert.html",
})
export class AlertModalViewComponent {
    private title: String;
    private message: String;
    private okButtonText: String;

    constructor(private params: ModalDialogParams, private page: Page) {
        this.title = params.context.title;
        this.message = params.context.message;
        this.okButtonText = params.context.okButtonText;
    }

    public submit() {
        this.params.closeCallback();
    }
}