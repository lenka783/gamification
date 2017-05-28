import { ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { AlertModalViewComponent, ConfirmModalViewComponent } from "./index";
import utils = require("utils/utils");

export class Dialogs {

    constructor(private _modalService: ModalDialogService, private vcRef: ViewContainerRef) {
    }

    public alert(title: String, message: String, okButtonText: String) {
        this._modalService.showModal(AlertModalViewComponent, {
            viewContainerRef: this.vcRef,
            context: {
                title: title,
                message: message,
                okButtonText: okButtonText
            },
            fullscreen: false
        });
    }

    public alertWithCallback(title: String, message: String, okButtonText: String, callback) {
        callback(this.alert(title, message, okButtonText));
    }

    public confirm(title: String, message: String, okButtonText: String): Promise<Boolean> {
        return new Promise((resolve) => {
            this._modalService.showModal(ConfirmModalViewComponent, {
                viewContainerRef: this.vcRef,
                context: {
                    title: title,
                    message: message,
                    okButtonText: okButtonText
                },
                fullscreen: false
            }).then(
                (result) => {
                    resolve(result);
                });
        });
    }
}