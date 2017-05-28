import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Injectable } from "@angular/core";

import { Page } from "ui/page";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";
import { RouterExtensions } from "nativescript-angular/router";

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared/index";
import { Account, Game, Repository } from "../../shared/sdk/models/index";
import { GameApi, AccountApi, RepositoryApi } from "../../shared/sdk/services/index";

import { isIOS, isAndroid } from "platform";

import application = require("application");
import utils = require("utils/utils");
import LocalNotifications = require("nativescript-local-notifications");

@Component({
    selector: "profile",
    templateUrl: "pages/profile/profile.html",
    providers: [GameApi, AccountApi, RepositoryApi],
    styleUrls: ["pages/profile/profile-common.css", "pages/profile/profile.css", "shared/sideDrawer/sideDrawer.css"]
})

@Injectable()
export class ProfileComponent implements OnInit, OnDestroy {

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private account: Account;
    private IsDrawerOpen: boolean;
    private sideDrawerNavigation: SideDrawerNavigation;
    private pageLoaded = false;
    private isIOS = isIOS;
    private isAndroid = isAndroid;

    constructor(
        private _routerExtensions: RouterExtensions,
        private _page: Page,
        private _account: AccountApi,
        private _game: GameApi) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_routerExtensions);
    }

    loadAccount() {
        this.account = this._account.getCachedCurrent();
        this.account.games = new Array<Game>();
        this.account.projects = new Array<Repository>();
    }

    ngAfterViewInit() {
        console.log("Drawer component: " + this.drawerComponent);
        this.drawer = this.drawerComponent.sideDrawer;
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.IsDrawerOpen = false;
        this.updateAccountInfo();
        this.printAccount();
        this.checkNotificationsPermission();
    }

    ngOnDestroy() {
        utils.GC();
    }

    updateAccountInfo() {
        let subscription = this._account.getGames(this.account.id).subscribe(
            games => {
                this.account.games = <Array<Game>>games;
                this.updateProjects();
            },
            error => console.log(error.message),
            () => subscription.unsubscribe()
        );
    }

    updateProjects() {
        let sub = this._account.getProjects(this.account.id).subscribe(
            projects => {
                this.account.projects = <Array<Repository>>projects;
                console.log(this.account.projects.length);
                this.pageLoaded = true;
            },
            error => console.log(error.message),
            () => sub.unsubscribe()
        );
    }

    printAccount() {
        console.log("Curently logged account: ");
        console.log("   ID: " + this.account.id);
        console.log("   Name: " + this.account.firstName + " " + this.account.lastName);
        console.log("   Contributor name: " + this.account.contributorName);
    }

    checkNotificationsPermission() {
        LocalNotifications.hasPermission().then(granted => {
            if (!granted) {
                LocalNotifications.requestPermission().then(result => {
                    if (result) {
                        console.log("Permission has been granted!");
                    } else {
                        console.log("Permission has not been granted!");
                    }
                });
            }
        })
    }

    openDrawer() {
        this.drawer.showDrawer();
    }

    closeDrawer() {
        this.drawer.closeDrawer();
    }

    onDrawerOpening() {
        console.log("Drawer opening");
        this.IsDrawerOpen = true;
    }

    onDrawerClosing() {
        console.log("Drawer closing");
        this.IsDrawerOpen = false;
    }

    logout() {
        this._account.logout();
        this._routerExtensions.navigate([""], { clearHistory: true });
        console.log("Account logged out!");
    }

    updateProfile() {
        this._routerExtensions.navigate(['updateProfile']);
    }
}
