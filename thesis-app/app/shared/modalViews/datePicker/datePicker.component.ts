import { Component, OnInit, NgModule } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { DatePicker } from "ui/date-picker";
import { Page } from "ui/page";

@Component({
    moduleId: module.id,
    templateUrl: "./datePicker.html",
})
export class DatePickerModalViewComponent implements OnInit {
    public currentdate: Date;

    constructor(private params: ModalDialogParams, private page: Page) {
        this.currentdate = new Date(params.context);
    }

    ngOnInit() {
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        datePicker.year = this.currentdate.getFullYear();
        datePicker.month = this.currentdate.getMonth() + 1;
        datePicker.day = this.currentdate.getDate();
        datePicker.minDate = new Date(1900, 0, 1);
        datePicker.maxDate = new Date(2049, 11, 31);
    }

    public submit() {
        let datePicker: DatePicker = <DatePicker>this.page.getViewById<DatePicker>("datePicker");
        this.params.closeCallback(datePicker.date);
    }
}