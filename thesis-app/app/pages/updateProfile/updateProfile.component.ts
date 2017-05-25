import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "data/observable";

import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";

import { Page } from "ui/page";

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared";
import { AccountApi } from "../../shared/sdk/services";
import { Account } from "../../shared/sdk/models";


@Component({
    selector: "updateProfile",
    templateUrl: "pages/updateProfile/updateProfile.html",
    providers: [ AccountApi],
    styleUrls: ["pages/updateProfile/updateProfile-common.css", "pages/updateProfile/updateProfile.css", "shared/sideDrawer/sideDrawer.css"]
})

export class UpdateProfileComponent extends Observable implements OnInit {

    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;

    private drawer: SideDrawerType;
    private account: Account;
    private IsIOsApp: boolean;
    private IsDrawerOpen: boolean;
    private sideDrawerNavigation: SideDrawerNavigation;

    constructor(
        private _router: Router,
        private _page: Page,
        private _changeDetectionRef: ChangeDetectorRef,
        private _account: AccountApi) {
        super();
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_router);
    }

    loadAccount() {
        this.account = this._account.getCachedCurrent();
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.IsIOsApp = Config.IOS_APP;
        this.IsDrawerOpen = false;
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
        this._router.navigate([""]);
        console.log("Account logged out!");
    }

    updateProfile() {
        this._account.patchAttributes(this.account.id, {
            "firstName": this.account.firstName, 
            "lastName": this.account.lastName,
            "contributorName": this.account.contributorName
        }).subscribe(
            () => {
                console.log("Profile updated!");
                this._router.navigate(['profile']);
            },
            error => console.log("ERROR: " + error.message)
        );
        
    }
}
