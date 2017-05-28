import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { Observable } from "data/observable";

import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";

import { Page } from "ui/page";

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared";
import { AccountApi } from "../../shared/sdk/services";
import { Account } from "../../shared/sdk/models";
import { Dialogs } from "../../shared/modalViews/index";
import { isIOS, isAndroid } from "platform";

import utils = require("utils/utils");


@Component({
    selector: "updateProfile",
    templateUrl: "pages/updateProfile/updateProfile.html",
    providers: [ AccountApi],
    styleUrls: ["pages/updateProfile/updateProfile-common.css", "pages/updateProfile/updateProfile.css", "shared/sideDrawer/sideDrawer.css"]
})

export class UpdateProfileComponent implements OnInit, OnDestroy {

    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;

    private drawer: SideDrawerType;
    private account: Account;
    private IsDrawerOpen: boolean;
    private sideDrawerNavigation: SideDrawerNavigation;
    private dialogs: Dialogs;
    private firstName;
    private lastName;
    private contributorName;
    private isIOS = isIOS;
    private isAndroid = isAndroid;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _page: Page,
        private _account: AccountApi,
        private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_routerExtensions);
        this.dialogs = new Dialogs(_modalService, vcRef);
    }

    loadAccount() {
        this.account = this._account.getCachedCurrent();
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.IsDrawerOpen = false;
        this.firstName = this.account.firstName;
        this.lastName = this.account.lastName;
        this.contributorName = this.account.contributorName;
    }

    ngOnDestroy() {
        utils.GC();
    }

    openDrawer() {
        this.drawer.showDrawer();
    }

    closeDrawer() {
        this.drawer.closeDrawer();
    }

    public onDrawerOpening() {
        console.log("Drawer opening");
        this.IsDrawerOpen = true;
    }

    public onDrawerClosing() {
        console.log("Drawer closing");
        this.IsDrawerOpen = false;
    }

    logout() {
        this._account.logout();
        this._routerExtensions.navigate([""], { clearHistory: true });
        console.log("Account logged out!");
    }

    updateProfile() {
        if (this.contributorName.length == 0 
            || this.firstName.length == 0 
            || this.lastName.length == 0) {
            this.dialogs.alert("ERROR: Empty fields", "You can't update blank fields!", "Ok");
            return;
        }
        let sub = this._account.patchAttributes(this.account.id, {
            "firstName": this.firstName, 
            "lastName": this.lastName,
            "contributorName": this.contributorName
        }).subscribe(
            () => {
                this.account.firstName = this.firstName;
                this.account.lastName = this.lastName;
                this.account.contributorName = this.contributorName;
                console.log("Profile updated!");
                this._routerExtensions.navigate(['profile']);
            },
            error => console.log("ERROR: " + error.message),
            () => sub.unsubscribe()
        );
        
    }
}
