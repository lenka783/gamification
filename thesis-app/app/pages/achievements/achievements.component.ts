import { Component, OnInit, ViewChild, ElementRef, Injectable, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "data/observable";

import { Page } from "ui/page";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular"

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared/index";
import { Account, Achievement, Game, Repository, RepositoryContributor } from "../../shared/sdk/models/index";
import { AchievementApi, GameApi, AccountApi, RepositoryApi, RepositoryContributorApi } from "../../shared/sdk/services/index";

import application = require("application");
import dialogs = require("ui/dialogs");

import LocalNotifications = require("nativescript-local-notifications");

@Component({
    selector: "profile",
    templateUrl: "pages/achievements/achievements.html",
    providers: [GameApi, AccountApi, AchievementApi],
    styleUrls: ["pages/achievements/achievements-common.css", "pages/achievements/achievements.css", "shared/sideDrawer/sideDrawer.css"]
})

@Injectable()
export class AchievementsComponent extends Observable implements OnInit {

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private account: Account;
    private IsIOsApp: boolean;
    private IsDrawerOpen: boolean;
    private sideDrawerNavigation: SideDrawerNavigation;

    constructor(
        private _router: Router,
        private _page: Page,
        private _changeDetectionRef: ChangeDetectorRef,
        private _account: AccountApi,
        private _game: GameApi,
        private _achievement: AchievementApi) {
        super();
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_router);
    }

    ngAfterViewInit() {
        console.log("Drawer component: " + this.drawerComponent);
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.IsIOsApp = Config.IOS_APP;
        this.IsDrawerOpen = false;
        this.updateGames();
    }

    updateGames() {
        this._account.getGames(this.account.id).subscribe(
            games => this.account.games = <Array<Game>>games,
            error => console.log(error.message)
        );
    }

    loadAccount() {
        this.account = this._account.getCachedCurrent();
        this.account.games = new Array<Game>();
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
        this._router.navigate([""]);
        console.log("Account logged out!");
    }

    showAchievement(game: Game) {
        this._achievement.find({
            where: {
                "accountID": this.account.id,
                "gameID": game.id
            }
        }).subscribe(
            result => dialogs.alert({
                title: "Congratulations!",
                message: "You succesfully played the game for " + (<Achievement>result.pop()).daysInRow + " days in a row!",
                okButtonText: "Thanks"
            }).then( () => console.log("Dialog closed!")),
            error => console.log("ERROR: " + error.message)
        )
    }
}