import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Injectable, ViewContainerRef } from "@angular/core";

import { Page } from "ui/page";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";
import { ModalDialogService} from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared/index";
import { Account, Achievement, Game, Repository, RepositoryContributor } from "../../shared/sdk/models/index";
import { AchievementApi, GameApi, AccountApi, RepositoryApi, RepositoryContributorApi } from "../../shared/sdk/services/index";
import { Dialogs } from "../../shared/modalViews/index";

import { isIOS, isAndroid } from "platform";
import application = require("application");
import utils = require("utils/utils");

import LocalNotifications = require("nativescript-local-notifications");

@Component({
    selector: "profile",
    templateUrl: "pages/achievements/achievements.html",
    providers: [GameApi, AccountApi, AchievementApi],
    styleUrls: ["pages/achievements/achievements-common.css", "pages/achievements/achievements.css", "shared/sideDrawer/sideDrawer.css"]
})

@Injectable()
export class AchievementsComponent implements OnInit, OnDestroy {

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private account: Account;
    private IsDrawerOpen: boolean;
    private sideDrawerNavigation: SideDrawerNavigation;
    private listLoaded = false;
    private dialogs: Dialogs;
    private isIOS = isIOS;
    private isAndroid = isAndroid;
    private subscriptions = new Array();

    constructor(
        private _routerExtensions: RouterExtensions,
        private _page: Page,
        private _account: AccountApi,
        private _game: GameApi,
        private _achievement: AchievementApi,
        private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_routerExtensions);
        this.dialogs = new Dialogs(_modalService, vcRef);
    }

    ngAfterViewInit() {
        console.log("Drawer component: " + this.drawerComponent);
        this.drawer = this.drawerComponent.sideDrawer;
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.IsDrawerOpen = false;
        this.updateGames();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        utils.GC();
    }

    updateGames() {
        this.subscriptions.push(this._account.getGames(this.account.id).subscribe(
            games => {
                this.account.games = <Array<Game>>games;
                this.listLoaded = true;
            },
            error => console.log(error.message)
        ));
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
        this._routerExtensions.navigate([""], { clearHistory: true });
        console.log("Account logged out!");
    }

    showAchievement(game: Game) {
        let subscription = this._achievement.find({
            where: {
                "accountID": this.account.id,
                "gameID": game.id
            }
        }).subscribe(
            result => this.dialogs.alert(
                "Congratulations!",
                "You succesfully played the game for " + (<Achievement>result.pop()).daysInRow + " days in a row!",
                "Thanks"),
            error => console.log("ERROR: " + error.message),
            () => subscription.unsubscribe()
        )
    }
}
