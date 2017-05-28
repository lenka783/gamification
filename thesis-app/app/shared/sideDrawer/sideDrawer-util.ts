import { RouterExtensions } from "nativescript-angular/router";

export class SideDrawerNavigation {
    constructor(private router: RouterExtensions){
    }

    public profile(){
        this.router.navigate(["profile"]);
    }

    public listOfGames(){
        this.router.navigate(["listOfGames"]);
    }

    public achievements() {
        this.router.navigate(["achievements"]);
    }

    public projects() {
        this.router.navigate(["projects"]);
    }
}