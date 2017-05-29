import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Injectable, ChangeDetectorRef, ViewContainerRef } from "@angular/core";

import { Page } from "ui/page";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui/sidedrawer/angular";
import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";

import { LoopBackConfig, Config, SideDrawerNavigation } from "../../shared/index";
import { Account, Game, Achievement, Repository, RepositoryContributor } from "../../shared/sdk/models/index";
import { GameApi, AccountApi, AchievementApi, RepositoryApi, RepositoryContributorApi } from "../../shared/sdk/services/index";

import { Dialogs } from "../../shared/modalViews/index";

import { isIOS, isAndroid } from "platform";
import application = require("application");
import utils = require("utils/utils");

import LocalNotifications = require("nativescript-local-notifications");

@Component({
    selector: "profile",
    templateUrl: "pages/projects/projects.html",
    providers: [GameApi, AccountApi, AchievementApi, RepositoryApi, RepositoryContributorApi],
    styleUrls: ["pages/projects/projects-common.css", "pages/projects/projects.css", "shared/sideDrawer/sideDrawer.css"]
})

@Injectable()
export class ProjectsComponent implements OnInit, OnDestroy {

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
        private _contributors: RepositoryContributorApi,
        private _modalService: ModalDialogService,
        private vcRef: ViewContainerRef) {
        LoopBackConfig.setBaseURL(Config.BASE_URL);
        LoopBackConfig.setApiVersion(Config.API_VERSION);
        this.loadAccount();
        this.sideDrawerNavigation = new SideDrawerNavigation(_routerExtensions);
        this.dialogs = new Dialogs(_modalService, vcRef)
    }

    loadAccount() {
        this.account = this._account.getCachedCurrent();
        this.account.projects = new Array<Repository>();
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
    }

    ngOnInit() {
        this._page.actionBarHidden = false;
        this.IsDrawerOpen = false;
        this.updateProjects();
    }

    ngOnDestroy() {
        this.free();
        utils.GC();
    }

    updateProjects() {
        this.subscriptions.push(this._account.getProjects(this.account.id).subscribe(
            projects => {
                this.account.projects = <Array<Repository>>projects;
                this.listLoaded = true;
            },
            error => console.log(error.message)
        ));
    }

    openDrawer() {
        this.drawer.showDrawer();
    }

    closeDrawer() {
        this.drawer.closeDrawer();
    }

    onDrawerOpening() {
        this.IsDrawerOpen = true;
    }

    onDrawerClosing() {
        this.IsDrawerOpen = false;
    }

    logout() {
        this._account.logout();
        this._routerExtensions.navigate([""], { clearHistory: true });
        console.log("Account logged out!");
    }

    showProjectInfo(repository: Repository) {
        let sub = this._contributors.find({
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
            },
            err => console.log(JSON.stringify(err)),
            () => sub.unsubscribe()
        )
    }

    free() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.drawer = null;
        this.account = null;
        this.sideDrawerNavigation = null;
        this.dialogs = null;
    }
}
