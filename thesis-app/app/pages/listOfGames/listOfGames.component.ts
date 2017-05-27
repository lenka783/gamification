import { Component, OnInit, ViewChild, ElementRef, Injectable, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "data/observable";
import { ObservableArray } from "data/observable-array";

import { Page } from "ui/page";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";
import { ModalDialogService } from "nativescript-angular/modal-dialog";

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared/index";
import { Account, Achievement, Game, Repository, RepositoryContributor } from "../../shared/sdk/models/index";
import { AchievementApi, GameApi, AccountApi, RepositoryApi, RepositoryContributorApi } from "../../shared/sdk/services/index";
import { Dialogs } from "../../shared/modalViews/index";

import application = require("application");

import LocalNotifications = require("nativescript-local-notifications");

@Component({
    selector: "listOfGames",
    templateUrl: "pages/listOfGames/listOfGames.html",
    providers: [GameApi, AccountApi, AchievementApi, RepositoryApi, RepositoryContributorApi],
    styleUrls: ["pages/listOfGames/listOfGames-common.css", "pages/listOfGames/listOfGames.css", "shared/sideDrawer/sideDrawer.css"]
})

@Injectable()
export class ListOfGamesComponent extends Observable implements OnInit {

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private gameList = new Array<Game>();
    private account: Account;
    private IsIOsApp: boolean;
    private IsDrawerOpen: boolean;
    private sideDrawerNavigation: SideDrawerNavigation;
    private project: Repository;
    private listLoaded = false;
    private dialogs: Dialogs;

    constructor(
        private _router: Router,
        private _page: Page,
        private _changeDetectionRef: ChangeDetectorRef,
        private _game: GameApi,
        private _account: AccountApi,
        private _achievement: AchievementApi,
        private _contributor: RepositoryContributorApi,
        private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
        super();
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_router);
        this.dialogs = new Dialogs(_modalService, vcRef);
    }

    loadAccount() {
        this.account = this._account.getCachedCurrent();
        this.account.games = new Array<Game>();
    }

    ngAfterViewInit() {
        console.log("Drawer component: " + this.drawerComponent);
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.updateGames();
        this.updateAccountGames();
        this.updateAccountProjects();
        this.IsIOsApp = Config.IOS_APP;
        this.IsDrawerOpen = false;
    }

    hasContributorNameAssigned() {
        return this.account.contributorName != null || this.account.contributorName.length > 0;
    }

    updateGames() {
        this._game.find().subscribe(
            (loadedGames: any) => {
                this.gameList = loadedGames;
                this.listLoaded = true;
            },
            error => console.log(error.message));
    }

    updateAccountGames() {
        this._account.getGames(this.account.id).subscribe(
            games => this.account.games = <Array<Game>>games,
            error => console.log(error.message)
        );
    }

    updateAccountProjects() {
        this._account.getProjects(this.account.id).subscribe(
            projects => this.account.projects = <Array<Repository>>projects,
            error => console.log(error.message)
        );
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

    join(game: Game) {
        if (!this.hasContributorNameAssigned)
        {
            this.dialogs.alert(
                "Missing contributor name.",
                "Please update your contributor name in profile section to join/leave game!",
                "Ok");
            return;
        }
        if (this.account.projects.length == 0) {
            this.dialogs.alert(
                "No project available.",
                "You don't have assigned any project. Contact your suspervisor.",
                "Ok");
            return;
        }
        if (this.account.games.filter(element => element.Name == game.Name).length != 0) {
            this.dialogs.alert(
                "Already a player.",
                "Check achievements for your progress.",
                "Ok");
        }
        else {
            this.dialogs.confirm(
                "Join game",
                "Do you wish to join this game?",
                "Yes").then(result => {
                if (result) {
                    console.log("Adding game \"" + game.CommonName + "\" from games.");
                    var notificationGameID = this.getHashCode(<String>game.id);
                    console.log("Notification game ID " + notificationGameID);
                    console.log("Account id: " + this.account.id);
                    console.log("Repository id: " + this.account.projects[0].id);
                    this._contributor.findOne({
                        where: {
                            accountID: this.account.id,
                            repositoryID: this.account.projects[0].id
                        }
                    }).subscribe(
                        repositoryContributor => {
                            console.log("Repository contributor:" + (<RepositoryContributor>repositoryContributor));
                            this._achievement.create({
                                "accountID": this.account.id,
                                "gameID": game.id,
                                "contributorName": this.account.contributorName,
                                "gitSearchPattern": game.GitSearchPattern,
                                "repositoryLocalAddress": (<RepositoryContributor>repositoryContributor).localAddress,
                                "lastUpdated": new Date(2017, 1, 1, 0, 0, 0, 0)
                            }).subscribe(
                                result => {
                                    var now = new Date();
                                    console.log("Game added.");
                                    LocalNotifications.schedule([{
                                        id: notificationGameID,
                                        title: "Notification",
                                        body: "Check your " + game.CommonName + " progress in achievements!",
                                        interval: 'day',
                                        at: new Date(new Date().setHours(13, 15, 0))
                                    }]);

                                    this.updateAccountGames();
                                },
                                error => console.log(error.message)
                                );
                        }, err => {
                            console.log(err.message);
                        });
                }
            })
        }
        console.log("Current number of games: " + this.account.games.length);
    }

    private getHashCode(string: String) {
        var hash = 0, i, chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    leave(game: Game) {
        if (!this.hasContributorNameAssigned)
        {
            this.dialogs.alert(
                "Missing contributor name.",
                "Please update your contributor name in profile section to join/leave game!",
                "Ok");
            return;
        }
        if (this.account.games.filter(element => element.Name == game.Name).length != 0) {
            this.dialogs.confirm(
                "Remove game",
                "Are you sure you want to quit the game? All your achievements will be lost!",
                "Yes").then(result => {
                if (result) {
                    this._achievement.findOne({
                        where: {
                            "accountID": this.account.id,
                            "gameID": game.id
                        }
                    }).subscribe(((achievement: Achievement) => {
                        console.log("Removing game \"" + game.CommonName + "\" from games.");
                        this._achievement.deleteById(achievement.id).subscribe(
                            result => {
                                var notificationGameID = this.getHashCode(<String>game.id);
                                console.log("Notification game ID " + notificationGameID);
                                LocalNotifications.cancel(notificationGameID);
                                this.updateAccountGames();
                                console.log("Game was removed from active games!");
                            },
                            error => console.log("ERROR: " + error.message));

                    }));
                }
            });
        }
        else {
            this.dialogs.confirm(
                "Not a player.",
                "Click \"Join\" to start playing the game.",
                "Join").then(
                result => {
                    if (result) { this.join(game) }
                });
        }
    }

    logout() {
        this._account.logout();
        this._router.navigate([""]);
        console.log("Account logged out!");
    }
}
