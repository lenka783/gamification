import { Component, OnInit, ViewChild, ElementRef, Injectable, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "data/observable";

import { Page } from "ui/page";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";
import { ModalDialogService } from "nativescript-angular/modal-dialog";

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared/index";
import { Account, Game, Achievement, Repository, RepositoryContributor } from "../../shared/sdk/models/index";
import { GameApi, AccountApi, AchievementApi, RepositoryApi, RepositoryContributorApi } from "../../shared/sdk/services/index";

import { Dialogs } from "../../shared/modalViews/index";

import application = require("application");

import LocalNotifications = require("nativescript-local-notifications");

@Component({
    selector: "profile",
    templateUrl: "pages/projects/projects.html",
    providers: [GameApi, AccountApi, AchievementApi, RepositoryApi, RepositoryContributorApi],
    styleUrls: ["pages/projects/projects-common.css", "pages/projects/projects.css", "shared/sideDrawer/sideDrawer.css"]
})

@Injectable()
export class ProjectsComponent extends Observable implements OnInit {

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    private account: Account;
    private IsIOsApp: boolean;
    private IsDrawerOpen: boolean;
    private sideDrawerNavigation: SideDrawerNavigation;
    private listLoaded = false;
    private dialogs: Dialogs;

    constructor(
        private _router: Router,
        private _page: Page,
        private _changeDetectionRef: ChangeDetectorRef,
        private _account: AccountApi,
        private _game: GameApi,
        private _achievement: AchievementApi,
        private _contributors: RepositoryContributorApi,
        private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
        super();
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_router);
        this.dialogs = new Dialogs(_modalService, vcRef)
    }

    loadAccount() {
        this.account = this._account.getCachedCurrent();
        this.account.games = new Array<Game>();
        this.account.projects = new Array<Repository>();
    }

    ngAfterViewInit() {
        this.printAccount();
        console.log("Drawer component: " + this.drawerComponent);
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.IsIOsApp = Config.IOS_APP;
        this.IsDrawerOpen = false;
        this.updateGames();
        this.updateProjects();
    }

    updateGames() {
        this._account.getGames(this.account.id).subscribe(
            games => this.account.games = <Array<Game>>games,
            error => console.log(error.message)
        );
    }

    updateProjects() {
        this._account.getProjects(this.account.id).subscribe(
            projects => {
                this.account.projects = <Array<Repository>>projects;
                this.listLoaded = true;
            },
            error => console.log(error.message)
        );
    }

    printAccount() {
        console.log("Curently logged account: ");
        console.log("   ID: " + this.account.id);
        console.log("   Name: " + this.account.firstName + " " + this.account.lastName);
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

    showProjectInfo(repository: Repository) {
        this._contributors.find({
            where: {
                accountID: this.account.id,
                repositoryID: repository.id
            }
        }).subscribe(
            result => {
                var repositoryContributor = <RepositoryContributor>result.pop();
                this.dialogs.alert(
                    "Project " + repository.projectName, 
                    "Your local address is:\n" + repositoryContributor.localAddress, 
                    "Thanks");
            }
        )
    }
}
