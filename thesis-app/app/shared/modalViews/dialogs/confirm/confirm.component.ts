import { Component, OnInit, NgModule } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { DatePicker } from "ui/date-picker";
import { Page } from "ui/page";

@Component({
    moduleId: module.id,
    templateUrl: "./confirm.html",
})
export class ConfirmModalViewComponent {
    private title: String;
    private message: String;
    private okButtonText: String;
    private cancelButtonText: String;

    constructor(private params: ModalDialogParams, private page: Page) {
        this.title = params.context.title;
        this.message = params.context.message;
        this.okButtonText = params.context.okButtonText;
        this.cancelButtonText = "Cancel";
    }

    public submit() {
        this.params.closeCallback(true);
    }
    
    public cancel() {
        this.params.closeCallback(false);
    }
}